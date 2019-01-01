#!/bin/bash

mkdir word2vec
mv query_similarity.cpp ./word2vec/
cd word2vec
git clone https://github.com/circulosmeos/gdown.pl.git
gdown.pl/gdown.pl https://drive.google.com/file/d/13TE2MtOMwgFB3zRavCYzKrd-I1WGcbNf/view GoogleNews-vectors-negative300_sorted_embeds.bin
gdown.pl/gdown.pl https://drive.google.com/file/d/1WBlltqv76rjBAKtkwsVZpB24aH1nuH2P/view GoogleNews-vectors-negative300_sorted_vocabs.txt
sudo apt update
sudo apt install g++ cmake -y
git clone https://github.com/oktal/pistache.git
cd pistache
git submodule update --init
mkdir build
cd build
cmake -G "Unix Makefiles" -DCMAKE_BUILD_TYPE=Release ..
make
sudo make install
cd ..
cd ..
g++ -O3 -march=native -g -std=c++17 query_similarity.cpp -lpthread -lpistache -o query_similarity
