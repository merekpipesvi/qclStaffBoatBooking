export type BoatUnavailable = {
    boatId: number;
    // date ISO string
    dateUnavailable: string;
};

export type GetBoatsUnavailableModel = Record<BoatUnavailable['dateUnavailable'], BoatUnavailable['boatId'][]>;
