import {Component, Inject, Injectable, OnInit} from '@angular/core';
import {PokemonService} from "../services/pokemons.service";


@Component({
  selector: 'app-pokemon',
  templateUrl: './pokemon.component.html',
  styleUrls: ['./pokemon.component.scss']
})

@Inject
export class PokemonComponent implements OnInit {
  pokemon: any;

  constructor(public pokemonService: PokemonService) { }

  ngOnInit() {}

  getThemAll() {
    this.pokemonService.getPokemon().subscribe((data: any) => {
      this.pokemon = data;
      console.log("Pokemon ", data)
    });
  }
}
