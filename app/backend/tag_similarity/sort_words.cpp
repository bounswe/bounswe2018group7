#include <cstdio>
#include <cstring>
#include <cmath>
#include <algorithm>
#include <vector>
#include <iostream>
#include <numeric>
#include <fstream>
#include <string>
using namespace std;

const long long max_w = 50;

int main(int argc, char *argv[]) {
	ios::sync_with_stdio(false);
	if(argc < 2) {
		cout << "Usage: ./sort_words <FILE>\nwhere FILE contains word projections in the BINARY FORMAT\n";
    	return 0;
	}
	auto f = fopen(argv[1], "rb");
	if(f == nullptr) {
		cout << "Input file not found\n";
		return -1;
	}
	long long words, size;
	fscanf(f, "%lld", &words);
	fscanf(f, "%lld", &size);
	auto vocab = new char[words * max_w];
	auto M = new float[words * size];
	if(M == nullptr) {
		cout << "Cannot allocate memory: " << (long long)words * size * sizeof(float) / 1048576 << " MB    " << words << "  " << size << "\n";
		return -1;
	}
	for (int b = 0; b < words; b++) {
		int a = 0;
		for(;;) {
			vocab[b * max_w + a] = fgetc(f);
			if(feof(f) || (vocab[b * max_w + a] == ' '))
				break;
			if((a < max_w - 1) && (vocab[b * max_w + a] != '\n'))
				a++;
		}
		vocab[b * max_w + a] = 0;
		for(a = 0; a < size; a++)
			fread(&M[a + b * size], sizeof(float), 1, f);
		float len = 0;
		for(a = 0; a < size; a++)
			len += M[a + b * size] * M[a + b * size];
		len = sqrt(len);
		for(a = 0; a < size; a++)
			M[a + b * size] /= len;
	}
	fclose(f);
	vector<long long> idx(words);
	iota(idx.begin(), idx.end(), 0ll);
	sort(idx.begin(), idx.end(), [&](const long long &a, const long long &b) -> bool {
		return strcmp(vocab + a * max_w, vocab + b * max_w) < 0;
	});
	string file_name = string(argv[1]);
	file_name = file_name.substr(0, file_name.find_last_of("."));
	ofstream out(file_name + "_sorted_vocabs.txt");
	out << words << ' ' << max_w << '\n';
	for(int i = 0; i < words; i++)
		out.write(&vocab[idx[i] * max_w], max_w * sizeof(char));
	out.close();
	ofstream outbin(file_name + "_sorted_embeds.bin");
	outbin << words << ' ' << size << '\n';
	for(int i = 0; i < words; i++)
		outbin.write(reinterpret_cast<char*>(&M[idx[i] * size]), size * sizeof(float));
	outbin.close();
	return 0;
}