# An Intuitive Platform for Societies (AIPS)

AIPS is a Web App to create a general, intuitive and interactive way of communication between students and societies.

# Start up

1. Install and run Docker on local environment
1. Add a env var file to the /config (**ask admin**)
1. Start docker containers ```docker-compose -f docker-compose.dev.yml up -d```
1. Install Yarn
1. Install and lock dependencies ```yarn```
1. Sequelize migrations ```yarn db:migrate```
1. Sequelize seeds ```yarn db:seed```
1. Run server ```yarn dev```

# TODO

- [ ] Websocket
- [ ] GUI for chat feature
- [ ] Clean up Group page, Profile page
- [ ] Group Admin page
- [x] Calendar Feature
- [ ] Tests
- [ ] Accessibility