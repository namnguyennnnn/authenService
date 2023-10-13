import { Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Comment {
    @PrimaryColumn()
    comment_id: string
}
