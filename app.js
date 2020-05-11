//Storage controller

(function () {
  const StorageCtrl = (function () {
    //public methods
    return {
      storeItems: function (item) {
        let items;
        //check if any items
        if (localStorage.getItem("items") === null) {
          items = [];
          //push new item
          items.push(item);

          //set localstorage
          localStorage.setItem("items", JSON.stringify(items));
        } else {
          //get what is already in LS
          items = JSON.parse(localStorage.getItem("items"));
          items.push(item);

          //reset LS
          localStorage.setItem("items", JSON.stringify(items));
        }
      },

      getItemsFromStorage: function () {
        let items;
        //check if any items
        if (localStorage.getItem("items") === null) {
          items = [];
        } else {
          items = JSON.parse(localStorage.getItem("items"));
        }
        return items;
      },
      updateItemStorage: function (updatedItem) {
        let items = JSON.parse(localStorage.getItem("items"));
        items.forEach(function (item, index) {
          if (updatedItem.id === item.id) {
            items.splice(index, 1, updatedItem);
          }
        });
        localStorage.setItem("items", JSON.stringify(items));
      },
      deleteItemFromStorage: function (id) {
        let items = JSON.parse(localStorage.getItem("items"));
        items.forEach(function (item, index) {
          if (id === item.id) {
            items.splice(index, 1);
          }
        });
        localStorage.setItem("items", JSON.stringify(items));
      },
      clearItemFromStorage: function () {
        localStorage.removeItem("items");
      },
    };
  })();

  //item controller
  const ItemCtrl = (function () {
    //constructor
    const Item = function (id, name, calories) {
      this.id = id;
      this.name = name;
      this.calories = calories;
    };

    //DS / State
    const data = {
      items: StorageCtrl.getItemsFromStorage(),
      currentItem: null,
      totalCalories: 0,
    };

    //Public methods

    return {
      getItems: function () {
        return data.items;
      },
      logData: function () {
        return data;
      },
      addItem: function (name, calories) {
        let ID;
        //create ID
        if (data.items.length > 0) {
          ID = data.items[data.items.length - 1].id + 1;
        } else {
          ID = 0;
        }

        //calories to num
        calories = parseInt(calories);

        //create new item
        newItem = new Item(ID, name, calories);
        data.items.push(newItem);

        return newItem;
      },
      getItemById: function (id) {
        let found = null;
        data.items.forEach(function (item) {
          if (item.id === id) {
            found = item;
          }
        });
        return found;
      },
      updatedItem: function (name, calories) {
        //calories to num
        calories = parseInt(calories);
        let found = null;
        data.items.forEach(function (item) {
          if (item.id === data.currentItem.id) {
            item.name = name;
            item.calories = calories;
          }
          found = item;
        });
        return found;
      },
      deleteItem: function (id) {
        //get ids
        const ids = data.items.map(function (item) {
          return item.id;
        });

        //get index
        const index = ids.indexOf(id);

        //remove item
        data.items.splice(index, 1);
      },
      clearAllItems: function () {
        data.items = [];
      },
      setCurrentItem: function (item) {
        data.currentItem = item;
      },
      getCurrentItem: function () {
        return data.currentItem;
      },
      getTotalCalories: function () {
        let total = 0;
        //loop and add calories
        data.items.forEach(function (item) {
          total += item.calories;
        });

        //set total in DS
        data.totalCalories = total;

        return data.totalCalories;
      },
    };
  })();

  //UI Controller
  const UICtrl = (function () {
    const UISelectors = {
      itemList: "#item-list",
      addBtn: ".add-btn",
      itemNameInput: "#item-name",
      itemCaloriesInput: "#item-calories",
      totalCalories: ".total-calories",
      updateBtn: ".update-btn",
      deleteBtn: ".delete-btn",
      updateBtn: ".update-btn",
      backBtn: ".back-btn",
      listItems: "#item-list li",
      clearBtn: ".clear-btn",
    };
    //Public methods
    return {
      populateItemList: function (items) {
        let html = "";

        items.forEach(function (item) {
          html += `<li class="collection-item" id="item-${item.id}"><strong>${item.name}</strong> <em>${item.calories} Calories</em><a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a></li>`;
        });
        //insert list items
        document.querySelector(UISelectors.itemList).innerHTML = html;
      },
      getItemInput: function () {
        return {
          name: document.querySelector(UISelectors.itemNameInput).value,
          calories: document.querySelector(UISelectors.itemCaloriesInput).value,
        };
      },

      addListItem: function (item) {
        //show list
        document.querySelector(UISelectors.itemList).style.display = "block";

        //create li element
        const li = document.createElement("li");
        li.className = "collection-item";
        li.id = `item-${item.id}`;
        li.innerHTML = `<strong>${item.name}</strong> <em>${item.calories} Calories</em><a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>`;
        //insert item
        document
          .querySelector(UISelectors.itemList)
          .insertAdjacentElement("beforeend", li);
      },
      updateListItem: function (item) {
        let listItems = document.querySelectorAll(UISelectors.listItems);

        //turn node list into array
        listItems = Array.from(listItems);
        listItems.forEach(function (listItem) {
          const itemID = listItem.getAttribute("id");
          if (itemID == `item-${item.id}`) {
            document.querySelector(
              `#${itemID}`
            ).innerHTML = `<strong>${item.name}</strong> <em>${item.calories} Calories</em><a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>`;
          }
        });
      },
      deleteListItem: function (id) {
        const itemID = `#item-${id}`;
        const item = document.querySelector(itemID);
        item.remove();
      },
      clearInput: function () {
        document.querySelector(UISelectors.itemNameInput).value = "";
        document.querySelector(UISelectors.itemCaloriesInput).value = "";
      },
      addItemToForm: function () {
        document.querySelector(
          UISelectors.itemNameInput
        ).value = ItemCtrl.getCurrentItem().name;
        document.querySelector(
          UISelectors.itemCaloriesInput
        ).value = ItemCtrl.getCurrentItem().calories;
        UICtrl.showEditState();
      },
      removeItems: function () {
        let listItems = document.querySelectorAll(UISelectors.listItems);

        //turn node to array
        listItems = Array.from(listItems);

        listItems.forEach(function (item) {
          item.remove();
        });
      },
      hideList: function () {
        document.querySelector(UISelectors.itemList).style.display = "none";
      },
      showTotalCalories: function (total) {
        document.querySelector(UISelectors.totalCalories).textContent = total;
      },
      clearEditState: function () {
        UICtrl.clearInput();
        document.querySelector(UISelectors.updateBtn).style.display = "none";
        document.querySelector(UISelectors.deleteBtn).style.display = "none";
        document.querySelector(UISelectors.backBtn).style.display = "none";
        document.querySelector(UISelectors.addBtn).style.display = "inline";
      },
      showEditState: function () {
        document.querySelector(UISelectors.updateBtn).style.display = "inline";
        document.querySelector(UISelectors.deleteBtn).style.display = "inline";
        document.querySelector(UISelectors.backBtn).style.display = "inline";
        document.querySelector(UISelectors.addBtn).style.display = "none";
      },
      getSelectors: function () {
        return UISelectors;
      },
    };
  })();

  //App Controller
  const App = (function (ItemCtrl, StorageCtrl, UICtrl) {
    //Load Event Listeners
    const loadEventListeners = function () {
      //Get UI Selectors
      const UISelectors = UICtrl.getSelectors();

      //Add item event
      document
        .querySelector(UISelectors.addBtn)
        .addEventListener("click", itemAddSubmit);

      // disable submit on enter
      document.addEventListener("keypress", function (e) {
        if (e.keyCode === 13 || e.which === 13) {
          e.preventDefault();
          return false;
        }
      });

      //edit icon click event
      document
        .querySelector(UISelectors.itemList)
        .addEventListener("click", itemEditClick);

      //update item event
      document
        .querySelector(UISelectors.updateBtn)
        .addEventListener("click", itemUpdateSubmit);
      //Back button event
      document
        .querySelector(UISelectors.backBtn)
        .addEventListener("click", UICtrl.clearEditState);
      //delete button event
      document
        .querySelector(UISelectors.deleteBtn)
        .addEventListener("click", itemDeleteSubmit);

      //clear button event
      document
        .querySelector(UISelectors.clearBtn)
        .addEventListener("click", clearAllItemsClick);
    };

    //Add item submit
    const itemAddSubmit = function (e) {
      //  get form input from UI controller
      const input = UICtrl.getItemInput();

      if (input.name !== "" && input.calories !== "") {
        //add item
        const newItem = ItemCtrl.addItem(input.name, input.calories);

        //add item to UI list
        UICtrl.addListItem(newItem);

        // get total calories
        const totalCalories = ItemCtrl.getTotalCalories();

        //add total calories to UI
        UICtrl.showTotalCalories(totalCalories);

        //store in localstorage
        StorageCtrl.storeItems(newItem);

        // clear fields
        UICtrl.clearInput();
      }

      e.preventDefault();
    };

    // click edit
    const itemEditClick = function (e) {
      if (e.target.classList.contains("edit-item")) {
        //get list item id
        const listId = e.target.parentNode.parentNode.id;

        //break into an array
        const listIdArray = listId.split("-");

        //get actual id
        const id = parseInt(listIdArray[1]);
        //get item
        const itemToEdit = ItemCtrl.getItemById(id);

        //set current item
        ItemCtrl.setCurrentItem(itemToEdit);

        //add item to form
        UICtrl.addItemToForm();
      }
      e.preventDefault();
    };

    //update item submit
    const itemUpdateSubmit = function (e) {
      //get item input
      const input = UICtrl.getItemInput();

      //update item
      const updatedItem = ItemCtrl.updatedItem(input.name, input.calories);

      //update UI
      UICtrl.updateListItem(updatedItem);

      // get total calories
      const totalCalories = ItemCtrl.getTotalCalories();

      //add total calories to UI
      UICtrl.showTotalCalories(totalCalories);

      //update localstorage
      StorageCtrl.updateItemStorage(updatedItem);

      //delete from LS
      StorageCtrl.deleteItemFromStorage(currentItem.id);

      UICtrl.clearEditState();
      e.preventDefault();
    };

    const itemDeleteSubmit = function (e) {
      //get current item
      const currentItem = ItemCtrl.getCurrentItem();

      //delete from DS
      ItemCtrl.deleteItem(currentItem.id);

      // delete from UI
      UICtrl.deleteListItem(currentItem.id);

      // get total calories
      const totalCalories = ItemCtrl.getTotalCalories();

      //add total calories to UI
      UICtrl.showTotalCalories(totalCalories);
      UICtrl.clearEditState();

      e.preventDefault();
    };

    //clear items event

    const clearAllItemsClick = function () {
      //delete all items from DS
      ItemCtrl.clearAllItems();

      // get total calories
      const totalCalories = ItemCtrl.getTotalCalories();

      //add total calories to UI
      UICtrl.showTotalCalories(totalCalories);
      UICtrl.clearEditState();

      //clear from LS

      StorageCtrl.clearItemFromStorage();

      //hide UL
      UICtrl.hideList();

      //remove from UI
      UICtrl.removeItems();
    };

    //public methods
    return {
      init: function () {
        //clear edit/set inital state
        UICtrl.clearEditState();

        //Fetch Items from DS
        const items = ItemCtrl.getItems();

        //check if any items
        if (items.length === 0) {
          UICtrl.hideList();
        } else {
          //Populate List from items
          UICtrl.populateItemList(items);
        }

        // get total calories
        const totalCalories = ItemCtrl.getTotalCalories();

        //add total calories to UI
        UICtrl.showTotalCalories(totalCalories);

        //load event listeners
        loadEventListeners();
      },
    };
  })(ItemCtrl, StorageCtrl, UICtrl);

  // initialiaze app
  App.init();
})();
