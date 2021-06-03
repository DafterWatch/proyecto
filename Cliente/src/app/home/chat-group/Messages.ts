/*export default class Messages {
    user: number;
    message: String;
    name : String;
    time : Date
}*/
//Type 1 = mensaje , type 2 = form, type 2 = Notificacion
export class ChatEvent{
    type : number;
    user : number;
    time : Date;
    name : String
}
export class Messages extends ChatEvent{
    message : String
}
export class Form extends ChatEvent{
    cuestions : Array<String>;
    cuestion : String;
    multipleAnswer : boolean;    
}
export class ChatNotification extends ChatEvent{    
    notification : String;
}