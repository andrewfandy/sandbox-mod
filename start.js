let _modPath;
const rs = GetRootScope();
rs.OpenMod = () => Remote.app.openLink('http://steamcommunity.com/sharedfiles/filedetails/stats/1109753463');
rs.SendMail = () => GetRootScope().sendMail('[slem]',' Thank you for using Sandbox Mod!',
`Hello!
This is [slem], I want to thank you for using my mod.

I will keep adding more stuff that is requested and suggested to the mod so keep tuned and leave some feedback if you want!

If you have time could you please leave a rating to the mod? This can be done <a onclick="GetRootScope().OpenMod()">here</a>.

-Have fun playing, [slem]`);


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
Helpers.ConsoleInfo('[MOD] Sandbox Helper loaded!');


exports.initialize = (modPath) =>{
    _modPath = modPath;

    Frameworks.push(
        {
            order: 14,
            name: 'pal',
            licenseCost: 0,
            maxFeatures: 42,
            maxFeatureLevel: 40,
        }
    );
    Helpers.ConsoleInfo('[MOD] Sandbox Pal framework loaded!');

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
                this.name = 'Jonas';
                this.giveMoney = (amount) => {
                  $rootScope.confirm('Are you sure?', `Are you sure you want ${numeral(amount).format(Configuration.CURRENCY_FORMAT)}?`, () => {
                  $rootScope.settings.balance += amount
                  $rootScope.addNotification("You 'borrowed' " + numeral(amount).format(Configuration.CURRENCY_FORMAT) + " !", 1);
                  });
                }

                this.giveXP = (amount) => {
                  $rootScope.confirm('Are you sure?', `Are you sure you want ${(amount)}XP ?`, () => {
                    $rootScope.settings.xp += amount
                    $rootScope.addNotification("Added " + amount + " XP!", 1);
                  });
                }

                this.giveMaxTire = () => {
                  $rootScope.confirm('Are you sure?', `Are you sure you want get max tire (xp) ?`, () => {
                    Cheats.GetMaxTier()
                    $rootScope.addNotification("Max tier given.", 1);

                  });
                }

                this.NextDay = () => {
                  $rootScope.confirm('Are you sure?', `Are you sure you want to skip a day?`, () => {
                    Cheats.SkipADay()
                    $rootScope.addNotification("You skipped one day.", 1);

                  });
                }

                this.Hype = () => {
                  $rootScope.confirm('Are you sure?', `Are you sure you want to add 100% hype to your projects.`, () => {
                    _.forEach($rootScope.settings.products, (product) => {product.hype = 100;})
                    $rootScope.addNotification("Added 100 hype to your products .", 1)
                  });
                }

                this.addUsers = () => {
                  $rootScope.confirm('Are you sure?', `Are you sure you want to add 500000 to <b>all</b> your projects.`, () => {
                    _.forEach($rootScope.settings.products, (product) => {product.users.Mobile += 500000;})
                    _.forEach($rootScope.settings.products, (product) => {product.users.Web += 500000;})
                    _.forEach($rootScope.settings.products, (product) => {product.users.Desktop += 500000;})
                    $rootScope.addNotification("Added 500000 users to your products.", 1);

                  });
                }

                this.InventoryGive = () => {
                  $rootScope.confirm('Are you sure?', `Are you sure you want to add 100 items of every item.`, () => {
                    let e = GetRootScope();
                    Components.forEach(t=>{
                        e.settings.inventory[t.name] += 100;
                    }
                    )
                    $rootScope.addNotification("Added 100 of every item to your inventory.", 1);

                  });
                }

                this.WorkHard = () => {
                  $rootScope.confirm('Are you sure?', `Are you sure you want to make all workers have 1000% productivity?`, () => {
                    exports.onNewHour = settings => {
                    	let allWorkstations = settings.office.workstations;
                    	allWorkstations.forEach(ws => {
                    		if (ws.employee != null) {
                    			ws.employee.speed = 1000
                    		}
                    	});
                    };
                    $rootScope.addNotification("Made all workers have 1000% productivity.", 1);

                  });
                }

                this.GoodMood = () => {
                  $rootScope.confirm('Are you sure?', `Are you sure you want to keep your employees always in good mood?`, () => {
                    exports.onNewHour = settings => {
                    	Game.Lifecycle.EmployeeStats.forEach(employeeStat => {
                    		employeeStat.employee.mood = 100;
                    	});
                    };
                    $rootScope.addNotification("Made all workers have 1000% productivity.", 1);

                  });
                }


            }
        }
    ]
};
Helpers.ConsoleInfo('[MOD] Sandbox menu loaded!');


exports.onLoadGame = settings => {
  Helpers.ConsoleInfo('I love lasagna');
};
exports.onNewHour = settings => {};

///
exports.onNewDay = settings => {
let currentDays = SettingsHelper.getValueOrDefault(settings, 'daysSinceInstall', 0);

  currentDays++;

//  if(currentDays = 5) {
// GetRootScope().SendMail()
// Helpers.ConsoleInfo('Thank you email sent.');
//  };

//  SettingsHelper.setValue(settings, 'daysSinceInstall', currentDays);
};

exports.onUnsubscribe = done => {
    Helpers.ConsoleInfo(`[MOD] Sandbox: User has just unsubscribed from this mod... :( `);
    done();
};
