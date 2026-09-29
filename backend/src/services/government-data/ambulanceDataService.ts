export class AmbulanceDataService {
  public static async getRegionalAmbulanceStats(): Promise<{
    state: string;
    totalPublicAmbulances: number;
    alsAmbulances: number;
    blsAmbulances: number;
    source: string;
  }> {
    return {
      state: 'Maharashtra',
      totalPublicAmbulances: 937,
      alsAmbulances: 233,
      blsAmbulances: 704,
      source: 'Maharashtra Health & 108 Emergency Medical Services (jk.data.gov.in)',
    };
  }
}
