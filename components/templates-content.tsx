"use client";

import { Folder, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import Instagram from "@/public/platform/instagram.png";
import SoundCloud from "@/public/platform/soundcloud.png";
import Image from "next/image";
import { useAuth } from "@/hooks/use-auth";
import { useUserInfo } from "@/hooks/use-user-info";
import React, { useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";

const PlatformIcon = ({ platform }: { platform: string }) => {
  switch (platform) {
    case "instagram":
      return (
        <Image
          src={Instagram}
          alt="Instagram"
          className="w-6 h-6 rounded-full"
        />
      );
    case "soundcloud":
      return (
        <Image
          src={SoundCloud}
          alt="SoundCloud"
          className="w-6 h-6 rounded-full"
        />
      );
    default:
      return <Music className="w-4 h-4 text-[#667085]" />;
  }
};
export default function TemplatesContent({ 
  onEditTemplate, 
  refreshTrigger 
}: { 
  onEditTemplate?: (template: any) => void;
  refreshTrigger?: number;
}) {
  const { userId, isLoading } = useAuth();
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Edit template handler
  const handleEdit = (template: any) => {
    console.log("Edit template clicked:", template);
    if (onEditTemplate) {
      onEditTemplate(template);
    }
  };
  // Delete template handler
  const handleDelete = async (templateId: string) => {
    if (!userId || !templateId) return;
    setDeletingId(templateId);
    try {
      const res = await fetch(
        `https://dev-api.findsocial.io/templates/${templateId}?user=${userId}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      if (data.success) {
        toast({
          title: "Template Deleted",
          description: data.message || "Template deleted successfully.",
          variant: "success",
        });
        setTemplates((prev) => prev.filter((tpl) => tpl.id !== templateId));
      } else {
        toast({
          title: "Delete Failed",
          description: data.message || "Failed to delete template.",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Delete Failed",
        description: "Network or server error.",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };
  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    fetch(`https://dev-api.findsocial.io/templates?user=${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.templates)) {
          setTemplates(data.templates);
        } else {
          setTemplates([]);
          setError("No templates found.");
        }
      })
      .catch(() => setError("Failed to fetch templates."))
      .finally(() => setLoading(false));
  }, [userId, refreshTrigger]);

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="bg-white rounded-lg border border-[#eaecf0] overflow-hidden">
        {/* Header */}
        <div className="px-4 sm:px-6 py-5 border-b border-[#eaecf0]">
          <h2 className="text-lg font-semibold text-[#101828]">
            Saved Data Filters
          </h2>
        </div>

        {/* Table for Desktop */}
        <div className="hidden md:block overflow-x-auto">
          {loading ? (
            <div className="p-6 text-center text-[#667085]">Loading...</div>
          ) : error ? (
            <div className="p-6 text-center text-[#da1e28]">{error}</div>
          ) : (
            <table className="w-full">
              <thead className="bg-[#f9fafb] border-b border-[#eaecf0]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#667085] uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#667085] uppercase tracking-wider">
                    Platform
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#667085] uppercase tracking-wider">
                    Added
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-[#667085] uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-[#eaecf0]">
                {templates.map((template) => (
                  <tr
                    key={template.id}
                    className="hover:bg-[#f9fafb] transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0">
                          <Folder className="w-5 h-5 text-[#667085]" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium text-[#101828] truncate">
                            {template.template_name}
                          </div>
                          <div className="text-sm text-[#667085] truncate">
                            {template.message || ""}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {template.platforms?.map((p: any, idx: number) => (
                          <PlatformIcon
                            key={idx}
                            platform={p.name?.toLowerCase?.() || ""}
                          />
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-[#667085]">
                        {template.created_at
                          ? new Date(template.created_at).toLocaleString()
                          : "-"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 cursor-pointer text-[#667085] hover:text-[#344054] hover:bg-[#f9fafb]"
                          onClick={() => handleEdit(template)}
                          title="Edit Template"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 cursor-pointer text-[#667085] hover:text-[#da1e28] hover:bg-[#fef3f2]"
                          onClick={() => handleDelete(template.id)}
                          disabled={deletingId === template.id}
                          title="Delete Template"
                        >
                          {deletingId === template.id ? (
                            <svg
                              className="animate-spin w-4 h-4 text-[#da1e28]"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                                fill="none"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                              />
                            </svg>
                          ) : (
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          )}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Cards for Mobile/Tablet */}
        <div className="md:hidden">
          <div className="divide-y divide-[#eaecf0]">
            {loading ? (
              <div className="p-6 text-center text-[#667085]">Loading...</div>
            ) : error ? (
              <div className="p-6 text-center text-[#da1e28]">{error}</div>
            ) : (
              templates.map((template) => (
                <div key={template.id} className="p-4">
                  <div className="flex items-start gap-3">
                    <Folder className="w-5 h-5 text-[#667085] flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-sm font-medium text-[#101828]">
                            {template.template_name}
                          </div>
                          <div className="text-sm text-[#667085]">
                            {template.message || ""}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-[#667085] hover:text-[#344054] hover:bg-[#f9fafb]"
                            onClick={() => handleEdit(template)}
                            title="Edit Template"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-[#667085] hover:text-[#da1e28] hover:bg-[#fef3f2]"
                            onClick={() => handleDelete(template.id)}
                            disabled={deletingId === template.id}
                          >
                            {deletingId === template.id ? (
                              <svg
                                className="animate-spin w-4 h-4 text-[#da1e28]"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                  fill="none"
                                />
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                />
                              </svg>
                            ) : (
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            )}
                          </Button>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {template.platforms?.map((p: any, idx: number) => (
                            <PlatformIcon
                              key={idx}
                              platform={p.name?.toLowerCase?.() || ""}
                            />
                          ))}
                        </div>
                        <div className="text-sm text-[#667085]">
                          {template.created_at
                            ? new Date(template.created_at).toLocaleString()
                            : "-"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
