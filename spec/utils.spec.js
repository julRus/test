const { expect } = require("chai");
const {
  formatDates,
  makeRefObj,
  formatComments
} = require("../db/utils/utils");

describe("formatDates", () => {
  it("Tests", () => {
    expect(formatDates()).to.equal(undefined);
  });
  it("Returns a new array without mutating the origional", () => {
    const list = [
      {
        title: "1",
        topic: "mitch"
      }
    ];
    const listCopy = [
      {
        title: "1",
        topic: "mitch"
      }
    ];
    // const format = formatDates(list);
    expect(listCopy).to.not.equal(list);
  });
  it("Retruns a new array with the first objects timestamp formatted", () => {
    const input = [
      {
        title: "A",
        topic: "mitch",
        author: "icellusedkars",
        body: "Delicious tin of cat food",
        created_at: 911564514171
      }
    ];
    const format = formatDates(input);
    expect(format).to.have.lengthOf(1);
    expect(format[0].created_at).to.eql(new Date(format[0].created_at));
  });
  it("Retruns a new array with the first objects timestamp formatted", () => {
    const input = [
      {
        title: "A",
        topic: "mitch",
        author: "icellusedkars",
        body: "Delicious tin of cat food",
        created_at: 911564514171
      },
      {
        title: "They're not exactly dogs, are they?",
        topic: "mitch",
        author: "butter_bridge",
        body: "Well? Think about it.",
        created_at: 533132514171
      },
      {
        title: "Seven inspirational thought leaders from Manchester UK",
        topic: "mitch",
        author: "rogersop",
        body: "Who are we kidding, there is only one, and it's Mitch!",
        created_at: 406988514171
      },
      {
        title: "Am I a cat?",
        topic: "mitch",
        author: "icellusedkars",
        body:
          "Having run out of ideas for articles, I am staring at the wall blankly, like a cat. Does this make me a cat?",
        created_at: 280844514171
      }
    ];
    const format = formatDates(input);
    expect(format).to.have.lengthOf(4);
    format.forEach(obj => {
      expect(obj.created_at).to.eql(new Date(obj.created_at));
    });
    // expect(format[1].created_at).to.eql(new Date(format[1].created_at));
  });
});

describe("makeRefObj", () => {
  it("Tests", () => {
    expect(makeRefObj()).to.equal(undefined);
  });
  it("Returns a new object without mutating the origional", () => {
    const list = [
      {
        article: 1,
        name: "mitch"
      }
    ];
    const listCopy = [
      {
        article: 1,
        name: "mitch"
      }
    ];
    // const ref = makeRefObj(list);
    expect(listCopy).to.deep.equal(list);
  });
  it("Returns a new array of one ref obj with a key of its article title with value refering to its article id", () => {
    const list = [
      {
        article_id: 1,
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100
      }
    ];
    expect(makeRefObj(list)).to.eql({
      "Living in the shadow of a great man": 1
    });
  });
  it("Returns a new array of one ref obj with a key of its article title with value refering to its article id", () => {
    const list = [
      {
        article_id: 1,
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100
      },
      {
        article_id: 4,
        title: "Eight pug gifs that remind me of mitch",
        topic: "mitch",
        author: "icellusedkars",
        body: "some gifs",
        created_at: 1289996514171
      },
      {
        article_id: 3,
        title: "Student SUES Mitch!",
        topic: "mitch",
        author: "rogersop",
        body:
          "We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages",
        created_at: 1163852514171
      },
      {
        article_id: 2,
        title: "UNCOVERED: catspiracy to bring down democracy",
        topic: "cats",
        author: "rogersop",
        body: "Bastet walks amongst us, and the cats are taking arms!",
        created_at: 1037708514171
      }
    ];
    expect(makeRefObj(list)).to.eql({
      "Living in the shadow of a great man": 1,
      "Eight pug gifs that remind me of mitch": 4,
      "Student SUES Mitch!": 3,
      "UNCOVERED: catspiracy to bring down democracy": 2
    });
  });
});

describe.only("formatComments", () => {
  it("Returns a new array without manipulating the origional", () => {
    const comments = [
      {
        author: "Penny",
        body: "It's greet!"
      }
    ];
    const ref = { 1: "1" };
    const commentsCopy = [
      {
        author: "Penny",
        body: "It's greet!"
      }
    ];
    // const format = formatComments(ref, comments);
    expect(comments).to.deep.equal(commentsCopy);
  });
  it("Returns a new array with the first created_at key formatted to a js date object", () => {
    const comments = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389
      }
    ];
    const ref = { "They're not exactly dogs, are they?": 1 };
    const format = formatComments(ref, comments);
    expect(format[0].created_at).to.eql(new Date(format[0].created_at));
  });
  it("Returns a new array with all created_at keys formatted to a js date object", () => {
    const comments = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389
      },
      {
        body:
          "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        belongs_to: "Living in the shadow of a great man",
        created_by: "butter_bridge",
        votes: 14,
        created_at: 1479818163389
      },
      {
        body:
          "Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.",
        belongs_to: "Living in the shadow of a great man",
        created_by: "icellusedkars",
        votes: 100,
        created_at: 1448282163389
      },
      {
        body: " I carry a log — yes. Is it funny to you? It is not to me.",
        belongs_to: "Living in the shadow of a great man",
        created_by: "icellusedkars",
        votes: -100,
        created_at: 1416746163389
      }
    ];
    const ref = { "They're not exactly dogs, are they?": 1 };
    const format = formatComments(ref, comments);
    format.forEach(obj => {
      expect(obj.created_at).to.eql(new Date(obj.created_at));
    });
  });
  it("Returns a new array of objects whose first created_by key is renamed to author", () => {
    const comments = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389
      }
    ];
    const ref = { 1: "1" };
    const format = formatComments(ref, comments);
    expect(format[0]).to.have.keys([
      "body",
      "author",
      "article_id",
      "votes",
      "created_at"
    ]);
  });
  it("Returns a new array of objects whose created_by keys are all renamed to author", () => {
    const comments = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389
      },
      {
        body:
          "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        belongs_to: "Living in the shadow of a great man",
        created_by: "butter_bridge",
        votes: 14,
        created_at: 1479818163389
      },
      {
        body:
          "Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.",
        belongs_to: "Living in the shadow of a great man",
        created_by: "icellusedkars",
        votes: 100,
        created_at: 1448282163389
      },
      {
        body: " I carry a log — yes. Is it funny to you? It is not to me.",
        belongs_to: "Living in the shadow of a great man",
        created_by: "icellusedkars",
        votes: -100,
        created_at: 1416746163389
      }
    ];
    const ref = { 1: "1" };
    const format = formatComments(ref, comments);
    format.forEach(obj => {
      expect(obj).to.have.keys([
        "body",
        "author",
        "article_id",
        "votes",
        "created_at"
      ]);
    });
  });
  it("Returns a new array with the first belongs_to key renamed as article_id with its value corresponding to the original title value provided", () => {
    const comments = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389
      }
    ];
    const ref = { "They're not exactly dogs, are they?": 5 };
    const format = formatComments(ref, comments);
    expect(format[0]).to.eql({
      body:
        "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
      article_id: 5,
      author: "butter_bridge",
      votes: 16,
      created_at: new Date(format[0].created_at)
    });
  });
  it("Returns a new array with the first belongs_to key renamed as article_id with its value corresponding to the original title value provided", () => {
    const comments = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389
      },
      {
        body:
          "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        belongs_to: "Living in the shadow of a great man",
        created_by: "butter_bridge",
        votes: 14,
        created_at: 1479818163389
      },
      {
        body:
          "Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.",
        belongs_to: "Living in the shadow of a great man",
        created_by: "icellusedkars",
        votes: 100,
        created_at: 1448282163389
      },
      {
        body: " I carry a log — yes. Is it funny to you? It is not to me.",
        belongs_to: "Living in the shadow of a great man",
        created_by: "icellusedkars",
        votes: -100,
        created_at: 1416746163389
      }
    ];
    const ref = {
      "They're not exactly dogs, are they?": 5,
      "Living in the shadow of a great man": 2
    };
    const format = formatComments(ref, comments);
    format.forEach(obj => {
      expect(obj).to.have.keys([
        "body",
        "article_id",
        "author",
        "votes",
        "created_at"
      ]);
    });
  });
});

// expect(format[0]).to.eql({
//   body:
//     "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
//   article_id: 5,
//   author: "butter_bridge",
//   votes: 16,
//   created_at: new Date(format[0].created_at)
// });
