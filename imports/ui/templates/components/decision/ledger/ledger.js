import { $ } from 'meteor/jquery';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';

import { setupSplit } from '/imports/ui/modules/split';
import { Contracts } from '/imports/api/contracts/Contracts';

import '/imports/ui/templates/components/decision/ledger/ledger.html';

Template.ledger.onCreated(function () {
  setupSplit();
});

Template.ledger.helpers({
  emptyThread() {
    if (Session.get('contract')) {
      if (Session.get('contract').events !== undefined && Session.get('contract').events.length > 0) {
        return false;
      }
      return true;
    }
    return undefined;
  },
  event() {
    if (Session.get('contract')) {
      return Session.get('contract').events;
    }
    return undefined;
  },
  peerVotes() {
    const tally = this;
    tally.options.view = 'userVotes';
    tally.options.sort = { timestamp: -1 };
    return tally;
  },
  postVotes() {
    const tally = this;
    tally.options.view = 'votes';
    tally.options.sort = { timestamp: -1 };

    // winning options
    const contract = Contracts.findOne({ keyword: Template.currentData().options.keyword });
    let maxVotes = 0;
    let winningBallot;
    if (contract && contract.tally) {
      for (const i in contract.tally.choice) {
        if (contract.tally.choice[i].votes > maxVotes) {
          maxVotes = contract.tally.choice[i].votes;
          winningBallot = contract.tally.choice[i].ballot;
        }
      }
      tally.winningBallot = winningBallot;
    }

    return tally;
  },
});

Template.ledger.events({
  'mousedown #resizable'(event) {
    event.preventDefault();
    Session.set('resizeSplit', true);
    Session.set('resizeSplitCursor', {
      x: parseInt(event.pageX - parseInt($('.split-right').css('marginLeft'), 10), 10),
      y: event.pageY,
    });
  },
});
