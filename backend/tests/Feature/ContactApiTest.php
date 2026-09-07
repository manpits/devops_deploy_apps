<?php

namespace Tests\Feature;

use App\Models\Contact;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ContactApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_register(): void
    {
        $response = $this->postJson('/api/register', [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure(['token', 'user' => ['id', 'name', 'email']]);

        $this->assertDatabaseHas('users', ['email' => 'john@example.com']);
    }

    public function test_user_can_login(): void
    {
        $user = User::factory()->create([
            'email' => 'login@example.com',
            'password' => bcrypt('password123'),
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'login@example.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure(['token', 'user']);
    }

    public function test_user_can_create_contact_with_multiple_phones(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/contacts', [
            'name' => 'Budi Pratama',
            'address' => 'Jl. Merdeka No. 10',
            'birth_date' => '1995-05-20',
            'phones' => [
                ['phone_number' => '08123456789', 'label' => 'Mobile'],
                ['phone_number' => '0215551234', 'label' => 'Office'],
            ],
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('data.name', 'Budi Pratama')
            ->assertJsonCount(2, 'data.phones');

        $this->assertDatabaseHas('contacts', [
            'user_id' => $user->id,
            'name' => 'Budi Pratama',
        ]);

        $this->assertDatabaseHas('contact_phones', [
            'phone_number' => '08123456789',
            'label' => 'Mobile',
        ]);
    }

    public function test_user_cannot_access_or_modify_other_user_contact(): void
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();

        $contactUser1 = Contact::create([
            'user_id' => $user1->id,
            'name' => 'Kontak User 1',
            'address' => 'Alamat 1',
        ]);
        $contactUser1->phones()->create([
            'phone_number' => '0811111111',
            'label' => 'Mobile',
        ]);

        // User 2 tries to GET User 1's contact -> 403
        $responseGet = $this->actingAs($user2, 'sanctum')->getJson("/api/contacts/{$contactUser1->id}");
        $responseGet->assertStatus(403);

        // User 2 tries to UPDATE User 1's contact -> 403
        $responseUpdate = $this->actingAs($user2, 'sanctum')->putJson("/api/contacts/{$contactUser1->id}", [
            'name' => 'Hacked Name',
            'phones' => [['phone_number' => '0899999999', 'label' => 'Hacked']],
        ]);
        $responseUpdate->assertStatus(403);

        // User 2 tries to DELETE User 1's contact -> 403
        $responseDelete = $this->actingAs($user2, 'sanctum')->deleteJson("/api/contacts/{$contactUser1->id}");
        $responseDelete->assertStatus(403);

        // Ensure contact is NOT in User 2's contact list
        $responseIndex = $this->actingAs($user2, 'sanctum')->getJson('/api/contacts');
        $responseIndex->assertStatus(200)
            ->assertJsonMissing(['name' => 'Kontak User 1']);
    }

    public function test_user_can_update_contact_and_sync_phones(): void
    {
        $user = User::factory()->create();
        $contact = Contact::create([
            'user_id' => $user->id,
            'name' => 'Nama Lama',
            'address' => 'Alamat Lama',
        ]);
        $contact->phones()->create(['phone_number' => '08111111', 'label' => 'Mobile']);

        $response = $this->actingAs($user, 'sanctum')->putJson("/api/contacts/{$contact->id}", [
            'name' => 'Nama Baru',
            'address' => 'Alamat Baru',
            'birth_date' => '1990-01-01',
            'phones' => [
                ['phone_number' => '08222222', 'label' => 'WhatsApp'],
                ['phone_number' => '08333333', 'label' => 'Office'],
            ],
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('data.name', 'Nama Baru')
            ->assertJsonCount(2, 'data.phones');

        $this->assertDatabaseMissing('contact_phones', ['phone_number' => '08111111']);
        $this->assertDatabaseHas('contact_phones', ['phone_number' => '08222222']);
        $this->assertDatabaseHas('contact_phones', ['phone_number' => '08333333']);
    }

    public function test_user_can_delete_contact(): void
    {
        $user = User::factory()->create();
        $contact = Contact::create([
            'user_id' => $user->id,
            'name' => 'Akan Dihapus',
        ]);
        $phone = $contact->phones()->create(['phone_number' => '08111111', 'label' => 'Mobile']);

        $response = $this->actingAs($user, 'sanctum')->deleteJson("/api/contacts/{$contact->id}");
        $response->assertStatus(200);

        $this->assertDatabaseMissing('contacts', ['id' => $contact->id]);
        $this->assertDatabaseMissing('contact_phones', ['id' => $phone->id]);
    }
}
