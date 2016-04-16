var PeopleListViewModel = require("../shared/peopleList-viewModel");

describe("People List View Model", function() {

    var pvm;

    beforeEach(function() {
        pvm = new PeopleListViewModel();
    });

    it("should have exist", function() {
        pvm.should.exist;
    });

    it("should have a length property", function() {
       pvm.length.should.exist;
    });

    it("should have a load function", function() {
        pvm.load.should.exist;
        (typeof pvm.load).should.equal("function");
    });


    it("should have an empty function", function() {
        pvm.empty.should.exist;

    });

    describe("PeopleListViewModel empty function", function() {

        it("should empty out the view model", function() {
            // arrange
            var expected = 0;
            pvm.push({ firstName: "Kenrick", lastName: "Wu" });

            // act
            pvm.empty();
            var actual = pvm.length;

            // assert
            assert.equal(expected, actual);
        });
    });
});
