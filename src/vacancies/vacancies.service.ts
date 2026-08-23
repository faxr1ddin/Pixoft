import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { QueryVacanciesDto } from './dto/query-vacancies.dto';

@Injectable()
export class VacanciesService {
  constructor(private readonly firebase: FirebaseService) {}

  async findAll(query: QueryVacanciesDto) {
    const { limit, cursor, search, category, workType, location, gender } = query;

    let q = this.firebase.firestore
      .collection('vacancies')
      .where('isActive', '==', true)
      .orderBy('createdAt', 'desc') as FirebaseFirestore.Query;

    if (category) q = q.where('category', '==', category);
    if (workType) q = q.where('workType', '==', workType);
    if (location) q = q.where('location', '==', location);
    if (gender) q = q.where('gender', '==', gender);

    if (cursor) {
      const cursorSnap = await this.firebase.firestore
        .collection('vacancies')
        .doc(cursor)
        .get();
      if (cursorSnap.exists) {
        q = q.startAfter(cursorSnap);
      }
    }

    // Fetch extra for in-memory search; no search → fetch limit+1 to detect hasMore
    const fetchLimit = search ? 500 : limit + 1;
    const snapshot = await q.limit(fetchLimit).get();

    let docs = snapshot.docs.map((doc) => this.serialize(doc));

    if (search) {
      const term = search.toLowerCase();
      docs = docs.filter(
        (v) =>
          v.title?.toLowerCase().includes(term) ||
          v.company?.toLowerCase().includes(term) ||
          v.location?.toLowerCase().includes(term),
      );
    }

    const hasMore = docs.length > limit;
    const data = docs.slice(0, limit);

    return {
      data,
      cursor: data.length > 0 ? data[data.length - 1].id : null,
      hasMore,
    };
  }

  private serialize(doc: FirebaseFirestore.QueryDocumentSnapshot) {
    const d = doc.data();
    return {
      id: doc.id,
      title: d.title ?? null,
      company: d.company ?? null,
      companyLogo: d.companyLogo ?? null,
      workType: d.workType ?? null,
      location: d.location ?? null,
      gender: d.gender ?? null,
      salaryMin: d.salaryMin ?? null,
      salaryMax: d.salaryMax ?? null,
      category: d.category ?? null,
      ageRange: d.ageRange ?? null,
      workSchedule: d.workSchedule ?? null,
      address: d.address ?? null,
      benefits: d.benefits ?? [],
      requirements: d.requirements ?? [],
      contactPhone: d.contactPhone ?? null,
      contactTelegram: d.contactTelegram ?? null,
      applyLink: d.applyLink ?? null,
      isActive: d.isActive ?? true,
      createdAt: d.createdAt?.toDate?.()?.toISOString() ?? null,
    };
  }
}
