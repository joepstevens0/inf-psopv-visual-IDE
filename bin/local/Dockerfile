FROM ubuntu:19.10
# install git and nodejs
RUN apt-get update && apt-get install -y curl git-core
RUN curl -sL https://deb.nodesource.com/setup_12.x | bash -
RUN apt-get install -y nodejs
# download our code and install dependencies using npm
#RUN git clone --depth 1 https://wout_oben:FJoeR7jN@didactiek-scm.edm.uhasselt.be:8181/scm/git/psopv-2020-groep5 /srv/WEBSITE
COPY ./ /srv/WEBSITE
RUN cd /srv/WEBSITE/src && npm install
RUN ["chmod", "+x", "/srv/WEBSITE/src/start.sh"]
RUN ["chmod", "+x", "/srv/WEBSITE/src/start-node.sh"]
# start server
CMD ["/srv/WEBSITE/src/start.sh"]
