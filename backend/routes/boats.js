import express from 'express';
import { 
  createBoatUnavailable, 
  deleteBoatUnavailable, 
  getBoatsUnavailableDates, 
  getDatesUnavailableByBoat, 
  getNumBoatsUnavailableByDate, 
  isHalfDay, 
  updateBookingIsConfirmedAfterInsertion 
} from '../database.js';
import { keepAlive, validateToken } from '../JWT.js';
import { adminOnly } from '../middleware.js';
import { BOATS_AVAILABLE, ISO_DATE_FORMAT } from '../constants.js';
import { format } from 'date-fns';

const router = express.Router();
router.use(validateToken);
router.use(keepAlive);

router.get("/", async (req, res) => {
    const { startDate, endDate } = req.query;
    const boats = await getBoatsUnavailableDates({startDate, endDate});
    const dateBoatMapping = {};

    boats.forEach(({ boatId, dateUnavailable }) => {
        const date = format(dateUnavailable, ISO_DATE_FORMAT);
        if (!dateBoatMapping[date]) {
          dateBoatMapping[date] = [];
        }
        dateBoatMapping[date].push(boatId);
    });
    res.send(dateBoatMapping);
})

router.put("/:boatId", adminOnly, async (req, res) => {
  // expects dates to be of type Date[]
  const { dates } = req.body;
  const boatId = req.params.boatId;
  try {
    dates.forEach(async (date) => {
      await createBoatUnavailable({boatId, date});
    })
  } catch (error) {
    res.status(400).send(error);
  }
  res.send(true);
})

router.delete("/:boatId", adminOnly, async (req, res) => {
  // expects dates to be of type Date[]
  const { dates } = req.body;
  const boatId = req.params.boatId;
  try {
    dates.forEach(async (date) => {
      // Delete the unavailable boat date
      await deleteBoatUnavailable({boatId, date});

      // Get new amount of boats available
      const numBoatsUnavailable = await getNumBoatsUnavailableByDate({date});
      const boatsAvailableForDate = BOATS_AVAILABLE - Object.values(numBoatsUnavailable)[0];

      // Get if the date is a half day
      const isDateHalfDay = await isHalfDay({date});
      
      // Now that there's less boats available, we need to change the confirmation status of users for that day.
      if(isDateHalfDay) {
        await updateBookingIsConfirmedAfterInsertion({date, isMorningBooking: true, boatsAvailableForDate});
        await updateBookingIsConfirmedAfterInsertion({date, isMorningBooking: false, boatsAvailableForDate});
      } else {
        await updateBookingIsConfirmedAfterInsertion({date, isMorningBooking: null, boatsAvailableForDate});
      }
    });
  } catch (error) {
    res.status(400).send(error);
  }
  res.send(true);
})

router.get("/:boatId", async (req, res) => {
  const boatId = Number(req.params.boatId);

  if (isNaN(boatId)) {
    res.status(400).send({message: "boatId should be a number"});
  }

  const boats = await getDatesUnavailableByBoat({boatId});

  // Send it as an array of dates in ISO format
  res.send(boats.map(({dateUnavailable}) => format(dateUnavailable, ISO_DATE_FORMAT)));
})

export default router;