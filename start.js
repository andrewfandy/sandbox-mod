let _modPath;

// This is for opening the mod link in-game.
GetRootScope().OpenMod = () => Remote.app.openLink('http://steamcommunity.com/sharedfiles/filedetails/stats/1109753463');

// I forgot what this does.
const SettingsHelper = {
    getValueOrDefault: (settings, key, defaultEntry) => {
        if(!settings.sandbox) {
            settings.sandbox = {};
        }

        if(!settings.sandbox[key]){
            settings.sandbox[key] = defaultEntry;
        }

        return settings.sandbox[key];

    },
    setValue: (settings, key, value) => {
        if(!settings.sandbox) {
            settings.sandbox = {};
        }

        settings.sandbox[key] = value;
    }
};

// THis says the mod loaded in console.
Helpers.ConsoleInfo('[MOD] Sandbox: Helper loaded!');


exports.initialize = (modPath) =>{
    _modPath = modPath;
    // Add a framework
    Frameworks.push(
      {
        cuPerMs: 0.1,
        licenseCost: 0,
        name: 'Electron',
        order: 0,
        pricePerUser: 1
      }
    );
    Helpers.ConsoleInfo('[MOD] Sandbox: Pal framework loaded!');

    // Add new menu item
    Modding.setMenuItem({
        name: 'sandbox',
        tooltip: "Sandbox Mod",
        tooltipPosition: 'top',
        faIcon: 'fa-terminal',
        badgeCount: 0,
    });

    // Define custom views
    exports.views = [
      {
        name: 'sandbox',
        viewPath: _modPath + 'view.html',
        controller: function ($rootScope) {
          this.giveMoney = (amount) => {
            GetRootScope().confirm('Are you sure?', `Are you sure you want ${numeral(amount).format(Configuration.CURRENCY_FORMAT)}?`, () => {
              $rootScope.settings.balance += amount
              $rootScope.addNotification("You 'borrowed' " + numeral(amount).format(Configuration.CURRENCY_FORMAT) + " !", 1)
            }
          )
        }

        this.giveXP = (amount) => {
          $rootScope.confirm('Are you sure?', `Are you sure you want ${(amount)}XP ?`, () => {
            $rootScope.settings.xp += amount
            $rootScope.addNotification("Added " + amount + " XP!", 1);
          }
        )
      }

        this.giveMaxTire = () => {
          $rootScope.confirm('Are you sure?', `Are you sure you want get max tire (xp) ?`, () => {
            Cheats.GetMaxTier()
            $rootScope.addNotification("Max tier given.", 1);
          }
        )
      }

        this.NextDay = () => {
          $rootScope.confirm('Are you sure?', `Are you sure you want to skip a day?`, () => {
            Cheats.SkipADay()
            $rootScope.addNotification("You skipped one day.", 1);
          }
        )
      }

        this.InventoryGive = () => {
          $rootScope.confirm('Are you sure?', `Are you sure you want to add 500 items of every item.`, () => {
            Components.forEach(t=>{
              GetRootScope().settings.inventory[t.name] += 500
            })
            $rootScope.addNotification("Added 500 of every item to your inventory.", 1);
          }
        )
      }

    }
  }
]
};

Helpers.ConsoleInfo('[MOD] Sandbox: Menu loaded!');
exports.onLoadGame = settings => {};
exports.onNewHour = settings => {};
exports.onNewDay = settings => {};
exports.onUnsubscribe = done => {
  Helpers.ConsoleInfo(`[MOD] Sandbox: User has just unsubscribed from this mod... :( `);
  done();
};
