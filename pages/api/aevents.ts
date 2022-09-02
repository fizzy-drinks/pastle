import foods from 'data/foods';
import getDbClient from 'data/services/getDbClient';
import ApiResponse from 'data/types/ApiResponse';
import GuessResult from 'data/types/GuessResult';
import { NextApiHandler } from 'next';

type EventType = 'impression' | 'game-interaction';

type SyntheticAnalyticsEvent<
  T extends EventType,
  M extends Record<string, unknown>
> = {
  id: number;
  session_id: string;
  event_type: T;
  metadata: M;
  date: Date;
};

type AnalyticsEvent =
  | SyntheticAnalyticsEvent<'impression', Record<string, never>>
  | SyntheticAnalyticsEvent<
      'game-interaction',
      {
        interactionType: 'guess';
        value: { guess: typeof foods[number]; result: GuessResult };
      }
    >;

export type AEventsPayload<T extends AnalyticsEvent = AnalyticsEvent> = {
  session_id: string;
  event_type: T['event_type'];
  metadata: T['metadata'];
};

type AEventInsertArgs<T extends AnalyticsEvent = AnalyticsEvent> = [
  string,
  T['event_type'],
  T['metadata'],
  Date
];

const handler: NextApiHandler<
  ApiResponse<{ aevents: AnalyticsEvent[] }>
> = async (req, res) => {
  if (req.method !== 'POST') {
    return res
      .status(405)
      .send({ success: false, message: 'Method not allowed' });
  }

  const { session_id, event_type, metadata }: Partial<AEventsPayload> =
    req.body;

  if (!session_id || !event_type || !metadata) {
    return res.status(400).send({
      success: false,
      message: 'Missing rqeuired request arguments!',
    });
  }

  const db = await getDbClient();

  const { rows: aevents } = await db.query<AnalyticsEvent, AEventInsertArgs>(
    `insert into aevents (session_id, event_type, metadata, date)
    values ($1, $2, $3, $4)
    returning *`,
    [session_id, event_type, metadata, new Date()]
  );

  res.send({ success: true, data: { aevents } });
};

export default handler;
