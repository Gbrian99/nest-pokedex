import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose'

export const POKEMON_MODEL_NAME = 'Pokemon';


@Schema()
export class Pokemon {
    deleteOne() {
      throw new Error('Method not implemented.');
    }
    toObject() {
      throw new Error('Method not implemented.');
    }
    toJSON() {
      throw new Error('Method not implemented.');
    }
    updateOne(updatePokemonDto: any, arg1: { new: boolean; }) {
      throw new Error('Method not implemented.');
    }

    // id: string // Mongo me lo da
    @Prop({
        unique: true,
        index: true,
    })
    name: string;

    @Prop({
        unique: true,
        index: true,
    })
    no: number;


}


export const PokemonSchema = SchemaFactory.createForClass ( Pokemon );
