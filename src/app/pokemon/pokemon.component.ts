import { Component, OnInit } from '@angular/core';
import {PokemonService} from "../services/pokemon.service";

@Component({
  selector: 'app-pokemon',
  templateUrl: './pokemon.component.html',
  styleUrls: ['./pokemon.component.scss']
})
export class PokemonComponent implements OnInit {
  pokemon: any;

  constructor(public pokemonService: PokemonService) { }

  ngOnInit() {}

  getThemAll() {
    this.pokemonService.getPokemon().subscribe(data => {
      this.pokemon = data;
      console.log("Pokemon ", data)
    });
  }
}
