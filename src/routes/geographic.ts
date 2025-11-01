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
        campaign.id,
        segments.date,
        segments.device,
        geographic_view.country_criterion_id,
        geographic_view.location_type,
        metrics.impressions,
        metrics.clicks,
        metrics.conversions,
        metrics.cost_micros
      FROM geographic_view
      WHERE segments.date DURING ${dateRange}
    `;

    console.log(`Fetching geographic metrics for customer ${customerId}`);
    const results = await customer.query(query);

    console.log(`Found ${results.length} geographic metric records`);
    res.json({ 
      success: true, 
      data: results,
      count: results.length 
    });

  } catch (error: any) {
    console.error('Error fetching geographic metrics:', error);
    res.status(500).json({ 
      error: 'Failed to fetch geographic metrics', 
      message: error.message,
      details: error.errors || error
    });
  }
});

export default router;
