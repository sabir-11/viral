export default async function handler(req, res) {
  const { videoUrl } = req.body;

  try {
    // Get thumbnail from TikTok/Reels URL
    let thumbnailUrl = '';
    
    if (videoUrl.includes('tiktok.com')) {
      const videoId = videoUrl.split('/video/')[1]?.split('?')[0];
      thumbnailUrl = `https://www.tikwm.com/video/media/cover/${videoId}.jpg`;
    } 
    else if (videoUrl.includes('instagram.com')) {
      thumbnailUrl = videoUrl + 'media?size=l';
    } 
    else {
      return res.status(400).json({ error: 'Unsupported platform' });
    }

    // Call DeepSeek API
    const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
    const deepseekResponse = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: "deepseek-vision",
        messages: [{
          role: "user",
          content: [
            { 
              type: "text", 
              text: "ACT as TikTok algorithm expert. Rate this video's viral potential 1-10. Give 3 actionable tips to improve views. Be brutally honest." 
            },
            { 
              type: "image_url", 
              image_url: { url: thumbnailUrl } 
            }
          ]
        }]
      })
    });

    const data = await deepseekResponse.json();
    const analysis = data.choices[0]?.message?.content || 'No analysis available';
    
    // Extract score from response
    const scoreMatch = analysis.match(/\b(\d+)\/10\b/);
    const score = scoreMatch ? scoreMatch[1] : 'N/A';

    res.status(200).json({ score, feedback: analysis });
    
  } catch (error) {
    console.error('DeepSeek API error:', error);
    res.status(500).json({ error: 'Analysis failed' });
  }
}
