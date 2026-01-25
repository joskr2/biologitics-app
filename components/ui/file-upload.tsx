"use client";

import { useState, useCallback } from "react";
import { Upload, X } from "lucide-react";

import { cn } from "@/lib/utils";

interface UploadResponse {
	success: boolean;
	url?: string;
	error?: string;
}

interface FileUploadProps {
	value?: string;
	onChange: (value: string) => void;
	accept?: string;
	placeholder?: string;
	className?: string;
	folder?: string;
}

export function FileUpload({
	value,
	onChange,
	accept = "image/*,video/*",
	placeholder = "Click para subir archivo",
	className,
	folder = "uploads",
}: FileUploadProps) {
	const [isUploading, setIsUploading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleFileChange = useCallback(
		async (e: React.ChangeEvent<HTMLInputElement>) => {
			const file = e.target.files?.[0];
			if (!file) return;

			setIsUploading(true);
			setError(null);

			try {
				const formData = new FormData();
				formData.append("file", file);
				formData.append("folder", folder);

				const response = await fetch("/api/upload", {
					method: "POST",
					body: formData,
				});

				const result = (await response.json()) as UploadResponse;

				if (!response.ok) {
					throw new Error(result?.error || "Upload failed");
				}

				if (result.url) {
					onChange(result.url);
				}
			} catch (err) {
				setError(err instanceof Error ? err.message : "Upload failed");
				console.error("Upload error:", err);
			} finally {
				setIsUploading(false);
			}
		},
		[folder, onChange],
	);

	const handleRemove = () => {
		onChange("");
	};

	return (
		<div className={cn("space-y-2", className)}>
			{value ? (
				<div className="relative rounded-lg border overflow-hidden bg-muted">
					{value.match(/\.(mp4|webm|mov)$/i) ? (
						<video
							src={value}
							className="w-full h-32 object-cover"
							muted
						/>
					) : (
						<img
							src={value}
							alt="Preview"
							className="w-full h-32 object-contain bg-muted"
						/>
					)}
					<p className="text-xs p-2 text-muted-foreground truncate">
						{value.split("/").pop()}
					</p>
					<button
						type="button"
						onClick={handleRemove}
						className="absolute top-2 right-2 p-1 bg-destructive text-white rounded hover:bg-destructive/80"
					>
						<X className="size-4" />
					</button>
				</div>
			) : (
				<label
					className={cn(
						"border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors block",
						"hover:border-primary hover:bg-muted/50",
						isUploading && "opacity-50 cursor-wait",
					)}
				>
					<input
						type="file"
						accept={accept}
						onChange={handleFileChange}
						disabled={isUploading}
						className="hidden"
					/>
					{isUploading ? (
						<div className="flex flex-col items-center gap-2">
							<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
							<p className="text-sm text-muted-foreground">Subiendo...</p>
						</div>
					) : (
						<div className="flex flex-col items-center gap-2">
							<Upload className="size-8 text-muted-foreground" />
							<p className="text-sm text-muted-foreground">{placeholder}</p>
						</div>
					)}
				</label>
			)}

			{error && (
				<p className="text-sm text-destructive bg-destructive/10 p-2 rounded">
					{error}
				</p>
			)}
		</div>
	);
}
