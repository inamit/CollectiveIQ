import {Db, MongoClient, Collection} from 'mongodb';
import { GlobalConfig } from '../config/config';


const {MONGO_CONNECTION, APARTMENT_DB} = GlobalConfig;
const mongoClient: MongoClient = new MongoClient(MONGO_CONNECTION as string);
const mongoInstance: Db = new Db(mongoClient, APARTMENT_DB as string);

export const provideMongoCollection = <T extends object>(collectionName: string): Collection<T> => {
    return mongoInstance.collection<T>(collectionName);
}
