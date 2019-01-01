#include <iostream>
#include <fstream>
#include <vector>
#include <string>
#include <set>
#include <map>
#include <cmath>
#include <chrono>
using namespace std;

class timer {
private:
	const chrono::high_resolution_clock::time_point start;
	string message;
	ostream &out;
public:
	timer(string _message = "", ostream &_out = cerr) : message(_message), out(_out), start(chrono::high_resolution_clock::now()) {}
	~timer() {
		chrono::duration<double> time_span = chrono::duration_cast<chrono::duration<double>>(chrono::high_resolution_clock::now() - start);
		out << message << time_span.count() << "s\n";
	}
};

const string file_name = "GoogleNews-vectors-negative300";
const string words_suffix = "_sorted_vocabs.txt";
const string embeds_suffix = "_sorted_embeds.bin";

float similarity(set<string> a, set<string> b) {
	if(a.size() == 0 || b.size() == 0)
		return 0.0f;
	set<string> c(a);
	c.insert(b.begin(), b.end());
	map<string, vector<float>> word_embed;
	size_t words, max_w, size;
	ifstream in(file_name + words_suffix);
	in >> words >> max_w;
	if(in.peek() == '\n')
		in.get();
	const size_t start = in.tellg();
	ifstream binin(file_name + embeds_suffix);
	size_t words1;
	binin >> words1 >> size;
	if(words != words1)
		return -1;
	if(binin.peek() == '\n')
		binin.get();
	const size_t binstart = binin.tellg();
	for(const auto &s: c) {
		auto read_str = [&](size_t m) -> string {
			auto pos = start + m * max_w * sizeof(char);
			in.seekg(pos);
			char ms[max_w];
			in.read(ms, max_w);
			return ms;
		};
		size_t l = 0, r = words - 1;
		while(l < r) {
			auto m = (l + r) / 2;
			auto ms = read_str(m);
			if(ms < s)
				l = m + 1;
			else
				r = m;
		}
		auto ms = read_str(l);
		if(ms == s) {
			auto pos = binstart + l * size * sizeof(float);
			binin.seekg(pos);
			vector<float> v(size);
			binin.read(reinterpret_cast<char*>(v.data()), size * sizeof(float));
			word_embed[s] = v;
		}
	}
	set<string> na;
	vector<float> va(size, 0.0f);
	for(const auto &s: a)
		if(word_embed.find(s) == word_embed.end())
			na.insert(s);
		else {
			auto &v = word_embed[s];
			for(int i = 0; i < size; i++)
				va[i] += v[i];
		}
	set<string> nb;
	vector<float> vb(size, 0.0f);
	for(const auto &s: b)
		if(word_embed.find(s) == word_embed.end())
			nb.insert(s);
		else {
			auto &v = word_embed[s];
			for(int i = 0; i < size; i++)
				vb[i] += v[i];
		}
	float found_sim = 0;
	if(a.size() > na.size() && b.size() > nb.size()) {
		float len = 0;
		for(int i = 0; i < va.size(); i++)
			len += va[i] * va[i];
		len = sqrt(len);
		for(int i = 0; i < va.size(); i++)
			va[i] /= len;
		len = 0;
		for(int i = 0; i < vb.size(); i++)
			len += vb[i] * vb[i];
		len = sqrt(len);
		for(int i = 0; i < vb.size(); i++)
			vb[i] /= len;
		for(int i = 0; i < size; i++)
			found_sim += va[i] * vb[i];
	}
	size_t cnt = 0;
	for(const auto &s: na)
		if(nb.find(s) != nb.end())
			cnt++;
	size_t tot_cnt_fnd = (a.size() - na.size()) * (b.size() - nb.size());
	size_t tot_cnt_nfnd = max(na.size(), nb.size());
	float sim = tot_cnt_fnd * found_sim + cnt * cnt;
	sim /= a.size() * b.size();
	return sim;
}

/* 
   Mathieu Stefani, 07 février 2016
   
   Example of a REST endpoint with routing
*/

#include <algorithm>
#include <sstream>
#include <set>
#include <string>

#include <pistache/http.h>
#include <pistache/router.h>
#include <pistache/endpoint.h>

using namespace std;
using namespace Pistache;

void handleReady(const Rest::Request& request, Http::ResponseWriter response) {
	timer t("Request took ");
	cerr << '\n' << request.body() << '\n';
	istringstream in(request.body());
	ostringstream out;
	for(string line; getline(in, line);) {
		istringstream in(line);
		int N, M;
		in >> N >> M;
		set<string> A;
		while(N--) {
			string s;
			in >> s;
			A.insert(s);
		}
		set<string> B;
		while(M--) {
			string s;
			in >> s;
			B.insert(s);
		}
		auto result = similarity(A, B);
		out << result << '\n';
	}
	cerr << out.str() << '\n';
    response.send(Http::Code::Ok, out.str());
}

class StatsEndpoint {
public:
    StatsEndpoint(Address addr)
        : httpEndpoint(std::make_shared<Http::Endpoint>(addr))
    { }

    void init(size_t thr = 2) {
        auto opts = Http::Endpoint::options()
            .threads(thr)
            .maxPayload(1 << 20)
            .flags(Tcp::Options::InstallSignalHandler);
        httpEndpoint->init(opts);
        setupRoutes();
    }

    void start() {
        httpEndpoint->setHandler(router.handler());
        httpEndpoint->serve();
    }

    void shutdown() {
        httpEndpoint->shutdown();
    }

private:
    void setupRoutes() {
        using namespace Rest;

        Routes::Get(router, "/ready", Routes::bind(&handleReady));
    }

    std::shared_ptr<Http::Endpoint> httpEndpoint;
    Rest::Router router;
};

int main(int argc, char *argv[]) {
	ios::sync_with_stdio(false);
    Port port(80);

    int thr = 1;

    if (argc >= 2) {
        port = std::stol(argv[1]);

        if (argc == 3)
            thr = std::stol(argv[2]);
    }

    Address addr(Ipv4::any(), port);

    cout << "Cores = " << hardware_concurrency() << endl;
    cout << "Using " << thr << " threads" << endl;

    StatsEndpoint stats(addr);

    stats.init(thr);
    stats.start();

    stats.shutdown();
}

/*
int main(int argc, char *argv[]) {
	ios::sync_with_stdio(false);
	if(argc < 4)
		return -1;
	string file_name(argv[1]);
	int N = stoi(argv[2]);
	int M = stoi(argv[3]);
	if(argc < 4 + N + M)
		return -1;
	set<string> a;
	for(int i = 4; i < 4 + N; i++)
		a.insert(argv[i]);
	set<string> b;
	for(int i = 4 + N; i < 4 + N + M; i++)
		b.insert(argv[i]);
	cout << similarity(file_name, a, b) << endl;
	return 0;
}
*/
