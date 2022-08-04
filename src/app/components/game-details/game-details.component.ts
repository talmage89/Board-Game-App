import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap, tap } from 'rxjs';
import { ListType } from 'src/app/enums/list-type';
import { Game } from 'src/app/interfaces/game';
import { GameService } from 'src/app/services/game.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-game-details',
  templateUrl: './game-details.component.html',
  styleUrls: ['./game-details.component.scss']
})
export class GameDetailsComponent implements OnInit {
  game: Game;
  ownedGames: {[id: string]: Game} = {};
  wishListGames: {[id: string]: Game} = {};

  constructor(
    private gameService: GameService,
    private localStorageService: LocalStorageService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.params.pipe(
      switchMap(params => {
        return this.gameService.getById(params['gameId'])
      }),
      tap(game => this.game = game[0])
    ).subscribe();

    this.localStorageService.getGameList(ListType.OWNED_LIST);
    this.localStorageService.getGameList(ListType.WISH_LIST);

    this.localStorageService.ownedGames.subscribe(games => this.ownedGames = _.mapKeys(games, 'id'));
    this.localStorageService.wishListGames.subscribe(games => this.wishListGames = _.mapKeys(games, 'id'));
  }

  setGameList(listType: ListType) {
    if (listType === ListType.OWNED_LIST) {
        if (this.ownedGames[this.game.id]) {
            this.localStorageService.deleteGame(this.game, ListType.OWNED_LIST);
        } else {
            if (this.wishListGames[this.game.id]) {
                this.localStorageService.deleteGame(this.game, ListType.WISH_LIST);
            }
            this.localStorageService.saveGame(this.game, ListType.OWNED_LIST);
        }
    } else {
        if (this.wishListGames[this.game.id]) {
            this.localStorageService.deleteGame(this.game, ListType.WISH_LIST);
        } else {
            if (this.ownedGames[this.game.id]) {
                this.localStorageService.deleteGame(this.game, ListType.OWNED_LIST);
            }
            this.localStorageService.saveGame(this.game, ListType.WISH_LIST);
        }
    }
}

}
