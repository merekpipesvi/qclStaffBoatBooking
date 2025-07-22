import express from 'express';
import { getUserById, getUsers, createUser, patchUser, deleteUser } from '../database.js';
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

// TODO: Does this use userId somehow??
router.patch("/:userId", async (req, res) => {
    const {isConfirmed = null, points = null, userId} = req.body;
    const result = await patchUser({isConfirmed, points, userId});
    res.send(result);
})

router.delete("/:userId", async (req, res) => {
    const deleteReturn = await deleteUser({userId: req.params.userId})
    res.send(deleteReturn);
})

// TODO: Not needed at this point...
// router.post("/", validateToken , async (req,res) => {
//     const {firstName, lastName, email, password, role, fishingLicence, pcoc} = req.body;
//     const user = await createUser({firstName, lastName, email, password, role, fishingLicence, pcoc});
//     res.status(201).send(user);
// })

export default router;