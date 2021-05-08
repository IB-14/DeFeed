const { assert } = require('chai')

const DeFeed= artifacts.require('./DeFeed.sol')

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('Defeed', ([deployer, author, donator]) => {
    let defeed

    before(async () => {
        defeed= await DeFeed.deployed()
    })

    describe('deployment', async () => {
        it('deploys succesfully', async()=> {
            const address= await defeed.address
            assert.notEqual(address, 0x0)
            assert.notEqual(address, '')
            assert.notEqual(address, null)
            assert.notEqual(address, undefined)
        })
        it('has a name', async()=> {
            const name = await defeed.name()
            assert.equal(name, 'DeFeed')
        })
    })

    describe('posts', async()=> {
        let result, postCount
        const hash= 'hash123'

        before(async () => {
            result= await defeed.uploadPost(hash, 'Post Description', {from: author})
            postCount= await defeed.postCount()
        })

        it('creates posts', async()=> {
            //SUCCESS
            assert.equal(postCount, 1)
            const event= result.logs[0].args
            assert.equal(event.id.toNumber(), postCount.toNumber(), 'id is correct')
            assert.equal(event.hash, hash, 'Hash is correct')
            assert.equal(event.description, 'Post Description', 'description is correct')
            assert.equal(event.donation, '0', 'donation is correct')
            assert.equal(event.author, author, 'author is correct')

            //FAILURE: Post must have hash
            await defeed.uploadPost('', 'Post Description', {from: author}).should.be.rejected;

            //FAILURE: Post must have description
            await defeed.uploadPost('Post hash', '', {from: author}).should.be.rejected;
        })

        //Check from Struct
        it('lists posts', async()=> {
            const post= await defeed.posts(postCount)
            assert.equal(post.id.toNumber(), postCount.toNumber(), 'id is correct')
            assert.equal(post.hash, hash, 'Hash is correct')
            assert.equal(post.description, 'Post Description', 'description is correct')
            assert.equal(post.donation, '0', 'donation is correct')
            assert.equal(post.author, author, 'author is correct')
        }) 

        it('allows users to donate on posts', async()=> {
            //Track author balance before purchase
            let oldAuthorBalance
            oldAuthorBalance= await web3.eth.getBalance(author)
            oldAuthorBalance= new web3.utils.BN(oldAuthorBalance)

            result= await defeed.donatePostAuthor(postCount, {from: donator, value: web3.utils.toWei('1', 'Ether')})

            //SUCCESS
            const event= result.logs[0].args
            assert.equal(event.id.toNumber(), postCount.toNumber(), 'id is correct')
            assert.equal(event.hash, hash, 'Hash is correct')
            assert.equal(event.description, 'Post Description', 'description is correct')
            assert.equal(event.donation, '1000000000000000000', 'donation is correct')
            assert.equal(event.author, author, 'author is correct')

            //Check that author recieved donation
            let newAuthorBalance
            newAuthorBalance= await web3.eth.getBalance(author)
            newAuthorBalance= new web3.utils.BN(newAuthorBalance)

            let donatePostAuthor
            donatePostAuthor= web3.utils.toWei('1', 'Ether')
            donatePostAuthor= new web3.utils.BN(donatePostAuthor)

            const expectedBalance= oldAuthorBalance.add(donatePostAuthor)

            assert.equal(newAuthorBalance.toString(), expectedBalance.toString())

            //FAILURE: Tries to donate to a post that does not exist
            await defeed.donatePostAuthor(99, {from: donator, value: web3.utils.toWei('1', 'Ether')}).should.be.rejected;

        })
    })
})


const Supply = artifacts.require('./Supply.sol')

contract('Supply', ([deployer, author, tipper]) => {
  let supply

  before(async () => {
    supply = await Supply.deployed()
  })

  describe('deployment', async () => {
    it('deploys successfully', async () => {
      const address = await supply.address
      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    })

    it('has a name', async () => {
      const name = await supply.name()
      assert.equal(name, 'Supply')
    })
  })

  describe('products', async ()=>{
    let result,productCount;
    const hash='abc123'
    const price=500

    before(async () => {
      result = await supply.uploadProduct(hash,'Product name',price,{from:author})
      productCount=await supply.productCount()
    })

    it('creates products', async ()=>{
      assert.equal(productCount,1)
      const event=result.logs[0].args;

      assert.equal(event.id.toNumber(),productCount.toNumber(),'id is correct')
      assert.equal(event.hash,hash,'hash is correct')
      assert.equal(event.name,'Product name','name is correct')
      assert.equal(event.price,price,'price is correct')
      assert.equal(event.author,author,'author is correct')

      await supply.uploadProduct('','Product Created',{from:author}).should.be.rejected;

      await supply.uploadProduct('Image Hash','',{from:author}).should.be.rejected;
    })

    it('lists products',async ()=>{ //fetching products
      const product=await supply.products(productCount);


      assert.equal(product.id.toNumber(),productCount.toNumber(),'id is correct')
      assert.equal(product.hash,hash,'hash is correct')
      assert.equal(product.name,'Product name','name is correct')
      assert.equal(product.price,price,'price is correct')
      assert.equal(product.author,author,'author is correct')
    })

    it('allows users to buy products', async () => {
      let oldAuthorBalance
      oldAuthorBalance = await web3.eth.getBalance(author)
      oldAuthorBalance = new web3.utils.BN(oldAuthorBalance)

      result = await supply.payProductOwner(productCount, { from: tipper, value: web3.utils.toWei('0.0000000000000005', 'Ether') })

      //SUCCESS
      const event = result.logs[0].args
      assert.equal(event.id.toNumber(), productCount.toNumber(), 'id is correct')
      assert.equal(event.hash, hash, 'Hash is correct')
      assert.equal(event.name, 'Product name', 'name is correct')
      assert.equal(event.price, price.toString(), 'price is correct')
      assert.equal(event.author, author, 'author is correct')

      // Check that author received funds
      let newAuthorBalance
      newAuthorBalance = await web3.eth.getBalance(author)
      newAuthorBalance = new web3.utils.BN(newAuthorBalance)

      let tipProductOwner
      tipProductOwner = web3.utils.toWei('0.0000000000000005', 'Ether')
      tipProductOwner = new web3.utils.BN(tipProductOwner)

      const expectedBalance = oldAuthorBalance.add(tipProductOwner)

      assert.equal(newAuthorBalance.toString(), expectedBalance.toString())

      // FAILURE: Tries to buy a product that does not exist
      await supply.payProductOwner(99, { from: tipper, value: web3.utils.toWei('0.0000000000000005', 'Ether')}).should.be.rejected;
     })

  })
})