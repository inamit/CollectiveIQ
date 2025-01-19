export default interface IMessage {
    senderId: string;
    message: string;
    senderUserName:string
    isAi?: boolean;
}