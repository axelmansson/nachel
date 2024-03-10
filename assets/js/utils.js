function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function getNewImage(diffculty) {
    const fruitListRes = await fetch('./assets/js/fruits.json')
    const fruitJson = await fruitListRes.json()
    const fruitList = fruitJson[diffculty];

    const randomIndex = getRandomInt(0, fruitList.length - 1)
    const nextFruit = fruitList[randomIndex]

    const res = await fetch(`https://api.unsplash.com/search/photos?page=1&query=${nextFruit}`, {
        headers: {
            'Authorization': `Client-ID xVIpgNqAs3BVnXXQIKccaWuI8ga4PYYAsS4LyVnkNEo`
        }
    })
    
    const response = await res.json()
    if(response?.total) {
        const firstSmallImage = response?.results?.[0]?.urls?.small;
        if(!firstSmallImage) {
            return getNewImage()
        }

        return {
            name: nextFruit.toLowerCase(),
            url: firstSmallImage
        }
    }

}