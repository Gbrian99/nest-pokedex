import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { isValidObjectId, Model } from 'mongoose';
import { Pokemon, POKEMON_MODEL_NAME } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';

import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PokemonService {

  private defaultLimit: number; 

  constructor(
    @InjectModel( Pokemon.name )
    private readonly pokemonModel: Model<Pokemon>,

    private readonly configService: ConfigService, 

  ) { 
    
    this.defaultLimit = configService.get<number>('defaultLimit') ?? 10;

  }


  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();

    try {

      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;

    } catch (error) {
      this.handleExceptions(error);
    }
  }

  findAll( paginationDto: PaginationDto ) {
    

    const { limit = this.defaultLimit , offset = 0 } = paginationDto;

    return this.pokemonModel.find()
      .limit( limit )
      .skip( offset )
      .sort({ no: 1 })
      .select('-__v')
  }

  async findOne(term: string) {

    let pokemon: Pokemon | null = null;

    if (!isNaN(+term)) {
      pokemon = await this.pokemonModel.findOne({ no: term });
    }

    // MongoID
    if (!pokemon && isValidObjectId(term)) {
      pokemon = await this.pokemonModel.findById(term);
    }

    // Name
    if (!pokemon) {
      pokemon = await this.pokemonModel.findOne({ name: term.toLocaleLowerCase().trim() })
    }


    if (!pokemon)
      throw new NotFoundException(`Pokemon with id, name or no "${term}" not found`);

    return pokemon;
  }

  
  async update(term : string, updatePokemonDto: any) {

    const pokemon = await this.findOne(term)

    if (updatePokemonDto.name) {
      updatePokemonDto.name = updatePokemonDto.name.toLocaleLowerCase();
    }

    try {

      await pokemon.updateOne(updatePokemonDto, { new: true })

      return { ...(pokemon.toObject ? pokemon.toObject() : pokemon), ...updatePokemonDto };
      
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    
    // const pokemon = await this.findOne( id );
    // await pokemon.deleteOne();
    // return { id }; 
    // const result = await this.pokemonModel.findByIdAndDelete(id);
    const { deletedCount} = await this.pokemonModel.deleteOne({_id: id });
    if ( deletedCount === 0 )
      throw new BadRequestException(`Pokemon with id "${id}" not found`);

    return ;
  }

  private handleExceptions(error: any) {
    if (error.code === 11000) {
        throw new BadRequestException(`Pokemon exists in db ${JSON.stringify(error.keyValue)}`);
      }
      console.log(error);
      throw new InternalServerErrorException(`Can't create Pokemon - Check server logs`);
      
    }

}
function limit(arg0: number) {
  throw new Error('Function not implemented.');
}

