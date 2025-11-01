import { Router } from 'express';
import { GoogleAdsApi } from 'google-ads-api';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const { customerId, refreshToken, dateRange = 'LAST_30_DAYS' } = req.body;

    if (!customerId || !refreshToken) {
      return res.status(400).json({ 
        error: 'Missing required fields: customerId, refreshToken' 
      });
    }

    const client = new GoogleAdsApi({
      client_id: process.env.GOOGLE_ADS_CLIENT_ID!,
      client_secret: process.env.GOOGLE_ADS_CLIENT_SECRET!,
      developer_token: process.env.GOOGLE_ADS_DEVELOPER_TOKEN!,
    });

    const customer = client.Customer({
      customer_id: customerId.replace(/-/g, ''),
      refresh_token: refreshToken,
    });

    const query = `
      SELECT 
        ad_group_criterion.criterion_id,
        ad_group_criterion.keyword.text,
        ad_group_criterion.keyword.match_type,
        campaign.id,
        campaign.name,
        ad_group.id,
        ad_group.name,
        segments.date,
        metrics.impressions,
        metrics.clicks,
        metrics.cost_micros,
        metrics.conversions
      FROM keyword_view
      WHERE segments.date DURING ${dateRange}
        AND ad_group_criterion.type = 'KEYWORD'
    `;

    console.log(`Fetching keywords for customer ${customerId}`);
    const results = await customer.query(query);

    console.log(`Found ${results.length} keyword records`);
    res.json({ 
      success: true, 
      data: [{ results }],
      count: results.length 
    });

  } catch (error: any) {
    console.error('Error fetching keywords:', error);
    res.status(500).json({ 
      error: 'Failed to fetch keywords', 
      message: error.message,
      details: error.errors || error
    });
  }
});

export default router;
