describe('App.Chat', function () {
    // inject app module
    beforeEach(module('chatApp'));

    var myCtr, scope;
    // define scope and controller before each test
    beforeEach(inject(function ($rootScope, $controller) {
        scope = $rootScope.$new();
        myCtr = $controller('chatCtr', {
            $scope: scope
        });
    }));

    describe('Default Scope', function () {
    	it('should have default values', function () {
        	expect(scope.selectedRoom).toEqual('choose a room');
        	expect(scope.rooms.length).toEqual(3);
   		});
    });
});
