from client.test import testClient

#app = create_app()

if __name__ == '__main__':
    #app.run(debug=True)
    client = testClient()
    print(client.get())
