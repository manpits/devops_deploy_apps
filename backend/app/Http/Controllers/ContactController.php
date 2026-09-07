<?php

namespace App\Http\Controllers;

use App\Http\Resources\ContactResource;
use App\Models\Contact;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\DB;

class ContactController extends Controller
{
    /**
     * Display a listing of the user's contacts.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = $request->user()->contacts()->with('phones');

        // Search query
        if ($search = $request->query('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('address', 'like', "%{$search}%")
                    ->orWhereHas('phones', function ($phoneQ) use ($search) {
                        $phoneQ->where('phone_number', 'like', "%{$search}%");
                    });
            });
        }

        // Birth month filter if provided
        if ($month = $request->query('month')) {
            if ($month !== 'all') {
                $query->whereMonth('birth_date', (int) $month + 1);
            }
        }

        $contacts = $query->latest('id')->get();

        return ContactResource::collection($contacts);
    }

    /**
     * Store a newly created contact with phones in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'address' => ['nullable', 'string', 'max:1000'],
            'birth_date' => ['nullable', 'date'],
            'phones' => ['required', 'array', 'min:1'],
            'phones.*.phone_number' => ['required', 'string', 'max:50'],
            'phones.*.label' => ['nullable', 'string', 'max:50'],
        ]);

        $contact = DB::transaction(function () use ($request, $validated) {
            $contact = $request->user()->contacts()->create([
                'name' => $validated['name'],
                'address' => $validated['address'] ?? null,
                'birth_date' => $validated['birth_date'] ?? null,
            ]);

            if (! empty($validated['phones'])) {
                foreach ($validated['phones'] as $phoneData) {
                    $contact->phones()->create([
                        'phone_number' => $phoneData['phone_number'],
                        'label' => $phoneData['label'] ?? 'Mobile',
                    ]);
                }
            }

            return $contact->load('phones');
        });

        return response()->json([
            'message' => 'Kontak berhasil ditambahkan',
            'data' => new ContactResource($contact),
        ], 201);
    }

    /**
     * Display the specified contact (Strict ownership check).
     */
    public function show(Request $request, Contact $contact): JsonResponse
    {
        if ($contact->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'Anda tidak memiliki hak akses untuk melihat kontak ini.',
            ], 403);
        }

        $contact->load('phones');

        return response()->json([
            'data' => new ContactResource($contact),
        ]);
    }

    /**
     * Update the specified contact in storage (Strict ownership check).
     */
    public function update(Request $request, Contact $contact): JsonResponse
    {
        if ($contact->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'Anda tidak memiliki hak akses untuk mengubah kontak ini.',
            ], 403);
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'address' => ['nullable', 'string', 'max:1000'],
            'birth_date' => ['nullable', 'date'],
            'phones' => ['required', 'array', 'min:1'],
            'phones.*.phone_number' => ['required', 'string', 'max:50'],
            'phones.*.label' => ['nullable', 'string', 'max:50'],
        ]);

        $updatedContact = DB::transaction(function () use ($contact, $validated) {
            $contact->update([
                'name' => $validated['name'],
                'address' => $validated['address'] ?? null,
                'birth_date' => $validated['birth_date'] ?? null,
            ]);

            // Re-sync phones
            $contact->phones()->delete();
            foreach ($validated['phones'] as $phoneData) {
                $contact->phones()->create([
                    'phone_number' => $phoneData['phone_number'],
                    'label' => $phoneData['label'] ?? 'Mobile',
                ]);
            }

            return $contact->load('phones');
        });

        return response()->json([
            'message' => 'Kontak berhasil diperbarui',
            'data' => new ContactResource($updatedContact),
        ]);
    }

    /**
     * Remove the specified contact from storage (Strict ownership check).
     */
    public function destroy(Request $request, Contact $contact): JsonResponse
    {
        if ($contact->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'Anda tidak memiliki hak akses untuk menghapus kontak ini.',
            ], 403);
        }

        $contact->delete();

        return response()->json([
            'message' => 'Kontak berhasil dihapus',
        ]);
    }
}
