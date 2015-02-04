/** @jsx React.DOM */

var React = window.React = require('react'),
    Timer = require("./ui/Timer"),
    mountNode = document.getElementById("app");

Array.prototype.naturalSort= function(){
    var a, b, a1, b1, rx=/(\d+)|(\D+)/g, rd=/\d+/;
    return this.sort(function(as, bs){
        a= String(as).toLowerCase().match(rx);
        b= String(bs).toLowerCase().match(rx);
        while(a.length && b.length){
            a1= a.shift();
            b1= b.shift();
            if(rd.test(a1) || rd.test(b1)){
                if(!rd.test(a1)) return 1;
                if(!rd.test(b1)) return -1;
                if(a1!= b1) return a1-b1;
            }
            else if(a1!= b1) return a1> b1? 1: -1;
        }
        return a.length- b.length;
    });
}

var PriorityTodoList = React.createClass({
    render: function () {
        // console.log(this.props.items);
        var self = this;
        var createItem = function (priority) {
            var findByPriority = function (el, index, arr) {
                return el.priority == priority;
            };
            var found = self.props.items.filter(findByPriority)[0];
            return <li key={'item-' + priority}>{found.text} ({found.priority})</li>;
        };

        var priorities = this.props.items.reduce(function (prev, curr, index) {
          return prev.concat(curr.priority);
        }, []);
        priorities.naturalSort();
        return <ul>{priorities.map(createItem)}</ul>;
    }
})

var PriorityTodoApp = React.createClass({
  getInitialState: function() {
    return {  priorities: [1,2,3,4,5,6,7,8,9,10],
              items: [],
              newItemText: '',
              newItemPriority: 1 };
  },
  onChangeText: function(e) {
    this.setState({ newItemText: e.target.value });
  },
  onChangePriority: function(e) {
    this.setState({ newItemPriority: e.target.value })
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var p =  parseInt(this.state.newItemPriority);

    if (!this.state.newItemText || this.state.newItemText == '') {
      console.warn('no todo name set!');
      return;
    }
    for (var i in this.state.items) {
      var item = this.state.items[i];
      if (item.hasOwnProperty('priority') && item.priority == p) {
        console.warn('no two items can have the same priority!');
        this.setState({ newItemPriority: this.state.priorities[0]});
        return;
      }
    }
    var newItem = {};
    newItem.text = this.state.newItemText;
    newItem.priority = p;
    var nextItems = this.state.items.concat([newItem]);
    var nextPriorities = this.state.priorities;
    if (nextPriorities.indexOf(p, 0) === -1) {
      console.warn('priority "' + p + '" not found!', nextPriorities.indexOf(p, 0))
      return;
    }

    nextPriorities.splice(nextPriorities.indexOf(p), 1);
    var nextItemPriority = nextPriorities[0];
    var nextText = '';
    this.setState({items: nextItems,
                  priorities: nextPriorities,
                  newItemText: nextText,
                  newItemPriority: nextItemPriority});
  },
  render: function() {
    var createPriorityOption = function (priority) {
      return <option key={priority} value={priority}>{priority}</option>;
    };

    return (
      <div>
        <h3>TODO</h3>
        <PriorityTodoList items={this.state.items} />
        <form onSubmit={this.handleSubmit}>
          <input onChange={this.onChangeText} value={this.state.newItemText} />
          <select onChange={this.onChangePriority} value={this.state.newItemPriority}>
            {this.state.priorities.map(createPriorityOption)}
          </select>
          <button>{'+ New Task Priority #' + (this.state.newItemPriority)}</button>
        </form>
        <Timer />
      </div>
    );
  }
});

React.render(<PriorityTodoApp />, mountNode);


