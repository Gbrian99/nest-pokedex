import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PokemonService } from './pokemon.service';
import { PokemonController } from './pokemon.controller';
import { Pokemon, POKEMON_MODEL_NAME, PokemonSchema } from './entities/pokemon.entity';

@Module({
  controllers: [ PokemonController ],
  providers: [ PokemonService ],
  imports: [
    MongooseModule.forFeature([
      {
        name: POKEMON_MODEL_NAME,
        schema: PokemonSchema
      }
    ])
  ]
})
export class PokemonModule {}
