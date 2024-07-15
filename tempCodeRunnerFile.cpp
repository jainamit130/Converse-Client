#include <iostream>
#include <vector>

using namespace std;

int count_unique_arrangements(int N) {
    return solve(N,0,0);
}

int solve(int N,int i,int streak){
    if(i==N){
        return 1;
    }

    int ans=0;
    if(streak==2){
        ans+=solve(N,i+1,0);
    } else {
        ans+=solve(N,i+1,1);
        ans+=solve(N,i+1,0);
    }
    return ans;
}

int main() {
    int T;
    cin >> T; 
    
    vector<int> results;
    
    for (int t = 0; t < T; ++t) {
        int N;
        cin >> N;
        
        int result = count_unique_arrangements(N);
        
        results.push_back(result);
    }
    
    for (int result : results) {
        cout << result << "\n";
    }
    
    return 0;
}
