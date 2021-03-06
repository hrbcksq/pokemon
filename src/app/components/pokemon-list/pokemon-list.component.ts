import { Component, OnInit } from '@angular/core';
import {PokemonApiService} from "../../services/pokemon-api.service";
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/first';

@Component({
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.css']
})
export class PokemonListComponent implements OnInit {
  public pokemonsList;
  public allPokemons;
  public allPokemonsStatic;
  public weight:number;
  public showDialog = false;
  public hiddenSpinne:boolean = false;
  constructor(private pokemonApiService: PokemonApiService) {
  }

  ngOnInit() {
    this.pokemonApiService.getPokemons().subscribe(pokemons=>{
      this.pokemonsList = pokemons;
      let pokemonNamesAll = this.pokemonsList.results.map(pokemon=>{
        return pokemon.name;
      });
      // let slicePokeminName = pokemonNamesAll.slice(0,11);
      Observable
        .forkJoin(...pokemonNamesAll.map(name => this.pokemonApiService.getPokemonItem(name)))
        .subscribe((result) => {
          this.allPokemons = result;
          this.allPokemonsStatic = this.allPokemons.slice();
          this.hiddenSpinne = !this.hiddenSpinne;
        });
    });
  }

  public filterPokemons(eve?){
    this.allPokemons = this.allPokemonsStatic;
    if(eve){
      this.allPokemons = this.allPokemons.filter(pokemon=>{
        return pokemon.weight <= this.weight;
      });
    }else{
      this.allPokemons = this.allPokemonsStatic;
    }
    this.allPokemons.sort((a,b)=>{
       return b.base_experience - a.base_experience;
    })
  }


  public openPopup(pokemon){
    this.showDialog = !this.showDialog;
    this.pokemonApiService.mainPokemon.next(pokemon);
  }
  public onClose(bool){
    console.log(bool);
    this.showDialog = bool;
  }
}
