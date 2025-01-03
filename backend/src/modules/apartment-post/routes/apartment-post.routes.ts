import { Router } from "express";
import {
    fetchAllApartments,
    insertApartment,
    editApartment,
    getApartmentsByUser,
    deleteApartment, commentOnApartment
} from "../controller/apartment-post.controller";
import { ApartmentPost } from "../../../models/apartmentPost";
import { userApartmentsUpload } from '../../../middleware/file-storage/file-storage-middleware';
import {Comment} from "../../../models/comment";

export const apartmentPostRouter: Router = Router();

apartmentPostRouter.get('/allPosts', async (req, res) => {
    const { page, pageSize, isPaginated } = req.query;
    console.info('Got request to fetch all posts');
    try {
        const apartmentPosts: ApartmentPost[] = await fetchAllApartments(Boolean(isPaginated) ? { page: Number(page), pageSize: Number(pageSize) } : undefined);
        res.status(200).send({ apartmentPosts });
    } catch (error) {
        console.error('Error fetching all posts: ', error);
        res.status(500).send({ error: (error as Error).message });
    }
});


apartmentPostRouter.get('/by-user', async (req, res) => {
    let { email } = req.query;

    console.info('Got request to fetch apartment-post by user');
    try {
        const apartmentPosts: ApartmentPost[] = await getApartmentsByUser(String(email));
        res.status(200).send({ apartmentPosts });
    } catch (error) {
        console.error('Error fetching all apartment-posts: ', error);
        res.status(500).send({ error: (error as Error).message });
    }
});

apartmentPostRouter.post('/comment', async (req, res) => {
    const comment: Comment = req.body as Comment;
    const userName: string = res.locals.authUser.authorUsername;
    comment.authorUsername = userName;
    console.log('Got request to add comment from user: ' + userName);
    try {
        await commentOnApartment(comment);
        res.status(201).send();
    } catch (error) {
        console.error('Failed to add comment. ', error);
        res.status(500).send({ error: (error as Error).message });
    }
});

apartmentPostRouter.post('/upload', userApartmentsUpload.single('file'), async (req, res) => {
    const userEmail: string = res.locals.authUser.email;
    console.log('Got request to upload apartment post from user', userEmail);
    const apartmentPost: ApartmentPost = req.body;
    apartmentPost.userName = userEmail;
    apartmentPost.imageUrl = req.file?.path ?? '';
    try {
        await insertApartment(apartmentPost);
        res.status(201).send();
    } catch (error) {
        console.error('Failed to upload new apartment post. ', error);
        res.status(500).send({ error: (error as Error).message });
    }
});

apartmentPostRouter.post('/edit', userApartmentsUpload.single('file'), async (req, res) => {
    const userEmail: string = res.locals.authUser.email;
    console.log('Got request to edit post from user', userEmail);
    const apartmentPost: ApartmentPost = req.body;
    if (!apartmentPost.imageUrl) {
        apartmentPost.imageUrl = req.file?.path ?? '';
    }
    const postId = apartmentPost.id
    if (!postId) {
        throw new Error('Missing post id');
    }
    try {
        await editApartment(postId, apartmentPost);
        res.status(201).send();
    } catch (error) {
        console.error(`Failed to edit post: ${apartmentPost.title}`, error);
        res.status(500).send({ error: (error as Error).message });
    }
});

apartmentPostRouter.delete('/delete', userApartmentsUpload.single('file'), async (req, res) => {
    const userEmail: string = res.locals.authUser.email;
    console.log('Got request to delete post from user', userEmail);
    const apartmentPost: ApartmentPost = req.body;
    try {
         await deleteApartment(apartmentPost.id);
        res.status(201).send();
    } catch (error) {
        console.error('Failed to delete new post. ', error);
        res.status(500).send({ error: (error as Error).message });
    }
});

//TODO: ADD authMiddleware into delete,edit,upload,comment