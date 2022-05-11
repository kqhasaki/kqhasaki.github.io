const base_url = 'https://netease-cloud-music-api-kqhasaki.vercel.app'

export async function getMusicUrlById(id) {
  try {
    const request = new Request(`${base_url}/song/url?id=${id}`, {
      method: 'GET',
    })
    const { data } = await fetch(request).then(res => res.json())

    return data[0]?.url
  } catch (ignore) {
    return null
  }
}
