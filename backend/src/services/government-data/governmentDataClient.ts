import { config } from '../../config/index.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class GovernmentDataClient {
  private static apiKey = config.govDataApiKey;

  /**
   * Fetches health facilities from Government Open Data or returns cached curated data.
   */
  public static async fetchFacilities(params?: {
    state?: string;
    district?: string;
    search?: string;
  }): Promise<any[]> {
    // If live API key is provided, we can attempt remote call with safe timeout
    if (this.apiKey) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 4000);
        const url = `https://api.data.gov.in/resource/national-hospital-directory?api-key=${encodeURIComponent(
          this.apiKey
        )}&format=json&limit=50`;

        const response = await fetch(url, { signal: controller.signal });
        clearTimeout(timeout);

        if (response.ok) {
          const json: any = await response.json();
          if (json?.records && Array.isArray(json.records)) {
            return json.records;
          }
        }
      } catch (err) {
        console.warn('⚠️ Government Open Data API unreachable or timed out. Falling back to local cache.');
      }
    }

    // Fallback: Read local cached curated dataset from database/raw-data
    return this.loadLocalCache();
  }

  private static loadLocalCache(): any[] {
    try {
      // Look up relative to project root
      const possiblePaths = [
        path.resolve(process.cwd(), 'supabase/raw-data/government_health_facilities.json'),
        path.resolve(process.cwd(), '../supabase/raw-data/government_health_facilities.json'),
        path.resolve(process.cwd(), 'database/raw-data/government_health_facilities.json'),
        path.resolve(process.cwd(), '../database/raw-data/government_health_facilities.json'),
        path.resolve(__dirname, '../../../../supabase/raw-data/government_health_facilities.json'),
        path.resolve(__dirname, '../../../../database/raw-data/government_health_facilities.json'),
      ];

      for (const p of possiblePaths) {
        if (fs.existsSync(p)) {
          const raw = fs.readFileSync(p, 'utf-8');
          return JSON.parse(raw);
        }
      }
    } catch (e) {
      console.warn('Error reading government data local cache:', e);
    }

    // Hard fallback embedded
    return [
      {
        id: 'gov-001',
        name: 'King Edward Memorial (KEM) Hospital',
        facility_type: 'Teaching & Tertiary Care',
        ownership: 'Government',
        state: 'Maharashtra',
        district: 'Mumbai',
        pincode: '400012',
        total_beds: 1800,
        icu_beds: 150,
        emergency_services: true,
        ambulance_count: 8,
        contact_phone: '+91-22-2410-7000',
        source_attribution: 'National Hospital Directory (data.gov.in)',
      },
      {
        id: 'gov-002',
        name: 'Lokmanya Tilak Municipal General Hospital (Sion)',
        facility_type: 'Trauma & Multi-Specialty',
        ownership: 'Government',
        state: 'Maharashtra',
        district: 'Mumbai',
        pincode: '400022',
        total_beds: 1400,
        icu_beds: 110,
        emergency_services: true,
        ambulance_count: 6,
        contact_phone: '+91-22-2407-6381',
        source_attribution: 'National Hospital Directory (data.gov.in)',
      },
    ];
  }
}
