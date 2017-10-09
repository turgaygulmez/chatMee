describe('App.Chat.Socket.Service', function () {

    var mock, socket;
    beforeEach(module('chatApp'));

    beforeEach(function () {
        inject(function ($injector) {
            socket = $injector.get('socket');
        });
    });

    it('should send an event', function () {
        spyOn(socket._testonly_.socket, "emit");
        socket.send(null, null)
        expect(socket._testonly_.socket.emit).toHaveBeenCalled();
    });

    it('should register an event', function () {
        spyOn(socket._testonly_.socket, "on");
        socket.register(null, null)
        expect(socket._testonly_.socket.on).toHaveBeenCalled();
    });
});
