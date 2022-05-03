var sha256 = require('sha256');

class MerkleHash{
    ComputeHash(value){
      // SHA256(JSON.stringify(data)).toString()
        var SHA256 = sha256(JSON.stringify(value));
        var hashValue = sha256(SHA256);
        return hashValue;
    }
    CompareHash(hash1, hash2){
        return hash1 === hash2;
    }
    CombinedHash(hash1, hash2){
        var finalPreHash = hash1 + hash2;
        var finalHash = this.ComputeHash(finalPreHash);
        return finalHash;
    }
}
module.exports = MerkleHash;