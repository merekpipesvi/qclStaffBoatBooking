export type BoatUnavailable = {
    boatId: number;
    // date ISO string
    dateUnavailable: string;
};

export type GetBoatsUnavailableModel = Record<BoatUnavailable['dateUnavailable'], BoatUnavailable['boatId'][]>;

export type ChangeBoatsUnavailableModel = Pick<BoatUnavailable, 'boatId'> & { dates: BoatUnavailable['dateUnavailable'][] };

export type GetDatesUnavailableByBoatModel = BoatUnavailable['dateUnavailable'][];
export type GetDatesUnavailableByBoatApiArg = Pick<BoatUnavailable, 'boatId'>;
