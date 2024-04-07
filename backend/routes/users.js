import express from 'express';
import { getUserById, getUsers, createUser, patchUser } from '../database.js';
import { validateToken } from '../JWT.js';
import { adminOnly } from '../middleware.js';

const router = express.Router();
router.use(validateToken);
router.use(adminOnly);

router.get("/", async (_req, res) => {
    const users = await getUsers();
    res.send(users);
})

router.get("/:userId", async (req, res) => {
    const user = await getUserById(req.params.userId);
    res.send(user);
})

router.patch("/:userId", async (req, res) => {
    const {isConfirmed = null, points = null, userId} = req.body;
    const result = await patchUser({isConfirmed, points, userId});
    res.send(result);
})

// TODO: Not needed at this point...
// router.post("/", validateToken , async (req,res) => {
//     const {firstName, lastName, email, password, role, fishingLicence, pcoc} = req.body;
//     const user = await createUser({firstName, lastName, email, password, role, fishingLicence, pcoc});
//     res.status(201).send(user);
// })

export default router;