<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ApprovalWorkflowNotification extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */

    protected $user;
    protected $status; // approved / rejected
    protected $reason;

    public function __construct($user, $status, $reason = null)
    {
        $this->user = $user;
        $this->status = $status;
        $this->reason = $reason;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail($notifiable)
    {
        // Default pesan
        $mail = new MailMessage;

        if ($this->status === 'approved') {
            $mail->subject('Pengajuan Anda Telah Disetujui')
                ->greeting('Halo ' . $this->user->name)
                ->line('Selamat! Pengajuan Anda telah disetujui oleh admin.')
                ->action('Lihat Detail', url('/dashboard'))
                ->line('Terima kasih telah menggunakan layanan kami.');
        } else {
            $mail->subject('Pengajuan Anda Ditolak ')
                ->greeting('Halo ' . $this->user->name)
                ->line('Mohon maaf, pengajuan Anda tidak dapat kami setujui saat ini.');

            if ($this->reason) {
                $mail->line('Alasan: ' . $this->reason);
            }

            $mail->line('Silakan periksa kembali data Anda dan ajukan ulang jika perlu.');
        }

        return $mail;
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
