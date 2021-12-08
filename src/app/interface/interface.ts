export interface Department{
  sno:string,
  name:string,
  create_date:Date,
  isactive:boolean
}
export interface RecipientMessage{
  sno:string,
  from:string,
  to:string,
  from_id:string,
  to_id:string,
  message_body:string,
  parent_message_id:string,
  attachment:string,
  is_read:number,
  is_deleted:boolean,
  create_date:Date,
}
