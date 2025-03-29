
from client.agiClient import agiClient
from anotherfolder.test2 import test2

#app = create_app()

if __name__ == '__main__':
    #app.run(debug=True)
    client = agiClient()
    print(client.get())
    client2 = test2()
    print(client2.get())
