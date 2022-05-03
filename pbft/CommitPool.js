const ChainUtil = require("./ChainUtil");

class CommitPool {
    constructor() {
        this.list = {};
    }

    commit(prepare, wallet) {
        var commit = this.createCommit(prepare, wallet);
        this.list[prepare.blockHash] = [];
        this.list[prepare.blockHash].push(commit);
        return commit;
    }

    createCommit(prepare, wallet) {
        var commit = {};
        commit.blockHash = prepare.blockHash;
        commit.publicKey = wallet.getPublicKey();
        commit.signature = wallet.sign(prepare.blockHash);
        return commit;
    }

    existingCommit(commit) {
        var exists = this.list[commit.blockHash].find(
            p => p.publicKey === commit.publicKey
        );
        return exists;
    }

    isValidCommit(commit) {
        return ChainUtil.verifySignature(commit.publicKey, commit.signature, commit.blockHash);
    }

    addCommit(commit) {
        this.list[commit.blockHash].push(commit);
    }
}

module.exports = CommitPool;