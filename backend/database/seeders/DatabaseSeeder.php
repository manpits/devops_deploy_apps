<?php

namespace Database\Seeders;

use App\Models\Contact;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Create Demo User 1
        $demoUser = User::firstOrCreate(
            ['email' => 'demo@example.com'],
            [
                'name' => 'Budi Pratama (Demo User)',
                'password' => Hash::make('password'),
            ]
        );

        // 2. Create Demo User 2 (For multi-tenant isolation testing)
        $otherUser = User::firstOrCreate(
            ['email' => 'user2@example.com'],
            [
                'name' => 'Siti Rahma (User Lain)',
                'password' => Hash::make('password'),
            ]
        );

        // 3. Seed Contacts for Demo User 1
        $contact1 = Contact::create([
            'user_id' => $demoUser->id,
            'name' => 'Andi Wijaya',
            'address' => 'Jl. Sudirman No. 45, Jakarta Selatan',
            'birth_date' => '1995-03-15',
        ]);
        $contact1->phones()->createMany([
            ['phone_number' => '081234567890', 'label' => 'WhatsApp'],
            ['phone_number' => '0215551234', 'label' => 'Kantor'],
        ]);

        $contact2 = Contact::create([
            'user_id' => $demoUser->id,
            'name' => 'dr. Rina Lestari, Sp.A',
            'address' => 'Klinik Bunda Medika, Jl. Gatot Subroto Kav. 12, Jakarta',
            'birth_date' => '1988-09-20',
        ]);
        $contact2->phones()->createMany([
            ['phone_number' => '081987654321', 'label' => 'Mobile'],
            ['phone_number' => '081399887766', 'label' => 'Darurat'],
            ['phone_number' => '0217894561', 'label' => 'Kantor'],
        ]);

        $contact3 = Contact::create([
            'user_id' => $demoUser->id,
            'name' => 'Dewi Anggraini',
            'address' => 'Perum Griya Indah Blok C3, Bandung',
            'birth_date' => '2000-09-12',
        ]);
        $contact3->phones()->createMany([
            ['phone_number' => '085712345678', 'label' => 'WhatsApp'],
        ]);

        // 4. Seed Contacts for User 2 (User 1 must NOT see these)
        $user2Contact = Contact::create([
            'user_id' => $otherUser->id,
            'name' => 'Kontak Rahasia Milik User 2',
            'address' => 'Jl. Rahasia No. 99, Surabaya',
            'birth_date' => '1992-01-01',
        ]);
        $user2Contact->phones()->createMany([
            ['phone_number' => '089999999999', 'label' => 'Mobile'],
        ]);
    }
}
